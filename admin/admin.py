from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from fuzzywuzzy import process
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

ICON_MAP = {
    'exam': 'fas fa-clipboard-check',
    'test': 'fas fa-clipboard-check',
    'grade': 'fas fa-chart-line',
    'assignment': 'fas fa-tasks',
    'library': 'fas fa-book',
    'document': 'fas fa-file-alt',
    'setting': 'fas fa-cog',
    'announcement': 'fas fa-bullhorn',
    'cursus': 'fas fa-graduation-cap',
    'calendar': 'fas fa-calendar-alt',
    'schedule': 'fas fa-calendar-alt',
    'message': 'fas fa-envelope',
    'profile': 'fas fa-user',
    'dashboard': 'fas fa-tachometer-alt',
    'class': 'fas fa-chalkboard-teacher',
    'lesson': 'fas fa-book-open',
    'gradebook': 'fas fa-clipboard-list',
    'progress': 'fas fa-chart-line',
    'resource': 'fas fa-folder-open',
    'communication': 'fas fa-envelope',
    'report': 'fas fa-file-chart',
    'user': 'fas fa-users',
    'server': 'fas fa-server',
    'backup': 'fas fa-database',
    'security': 'fas fa-shield-alt',
    'update': 'fas fa-download',
    'maintenance': 'fas fa-tools',
    'analytics': 'fas fa-chart-pie',
    'research': 'fas fa-microscope',
    'literature': 'fas fa-book-reader',
    'data': 'fas fa-chart-area',
    'thesis': 'fas fa-pen-fancy',
    'publication': 'fas fa-newspaper',
    'conference': 'fas fa-users',
    'meeting': 'fas fa-handshake',
    'archive': 'fas fa-archive',
    'monitoring': 'fas fa-desktop',
    'attendance': 'fas fa-check-square',
    'bibliography': 'fas fa-book',
    'default': 'fas fa-cube'
}

DEFAULT_LAYOUTS = {
    'student': [
        {'id': 'my-cursus', 'title': 'My Cursus', 'icon': 'fas fa-graduation-cap', 'color': None, 'visible': True},
        {'id': 'announcements', 'title': 'Announcements', 'icon': 'fas fa-bullhorn', 'color': None, 'visible': True},
        {'id': 'schedule', 'title': 'Emploi du Temps', 'icon': 'fas fa-calendar-alt', 'color': None, 'visible': True},
        {'id': 'virtual-library', 'title': 'Virtual Library', 'icon': 'fas fa-book', 'color': None, 'visible': True},
        {'id': 'grades', 'title': 'Grades', 'icon': 'fas fa-chart-bar', 'color': None, 'visible': True},
        {'id': 'assignments', 'title': 'Assignments', 'icon': 'fas fa-tasks', 'color': None, 'visible': True},
        {'id': 'documents', 'title': 'Documents', 'icon': 'fas fa-file-alt', 'color': None, 'visible': True},
        {'id': 'settings', 'title': 'Settings', 'icon': 'fas fa-cog', 'color': None, 'visible': True}
    ],
    'teacher': [
        {'id': 'my-classes', 'title': 'My Classes', 'icon': 'fas fa-chalkboard-teacher', 'color': None, 'visible': True},
        {'id': 'lesson-plans', 'title': 'Lesson Plans', 'icon': 'fas fa-book-open', 'color': None, 'visible': True},
        {'id': 'gradebook', 'title': 'Gradebook', 'icon': 'fas fa-clipboard-list', 'color': None, 'visible': True},
        {'id': 'student-progress', 'title': 'Student Progress', 'icon': 'fas fa-chart-line', 'color': None, 'visible': True},
        {'id': 'resources', 'title': 'Teaching Resources', 'icon': 'fas fa-folder-open', 'color': None, 'visible': True},
        {'id': 'calendar', 'title': 'Academic Calendar', 'icon': 'fas fa-calendar', 'color': None, 'visible': True},
        {'id': 'communications', 'title': 'Communications', 'icon': 'fas fa-envelope', 'color': None, 'visible': True},
        {'id': 'reports', 'title': 'Reports', 'icon': 'fas fa-file-chart', 'color': None, 'visible': True}
    ],
    'ats': [
        {'id': 'dashboard', 'title': 'System Dashboard', 'icon': 'fas fa-tachometer-alt', 'color': None, 'visible': True},
        {'id': 'user-management', 'title': 'User Management', 'icon': 'fas fa-users', 'color': None, 'visible': True},
        {'id': 'server-status', 'title': 'Server Status', 'icon': 'fas fa-server', 'color': None, 'visible': True},
        {'id': 'backup-restore', 'title': 'Backup & Restore', 'icon': 'fas fa-database', 'color': None, 'visible': True},
        {'id': 'security-logs', 'title': 'Security Logs', 'icon': 'fas fa-shield-alt', 'color': None, 'visible': True},
        {'id': 'system-updates', 'title': 'System Updates', 'icon': 'fas fa-download', 'color': None, 'visible': True},
        {'id': 'maintenance', 'title': 'Maintenance', 'icon': 'fas fa-tools', 'color': None, 'visible': True},
        {'id': 'analytics', 'title': 'Analytics', 'icon': 'fas fa-chart-pie', 'color': None, 'visible': True}
    ],
    'doctoral': [
        {'id': 'dashboard', 'title': 'Dashboard', 'icon': 'fas fa-tachometer-alt', 'color': None, 'visible': True},
        {'id': 'research', 'title': 'Research', 'icon': 'fas fa-microscope', 'color': None, 'visible': True},
        {'id': 'stages', 'title': 'Internships', 'icon': 'fas fa-briefcase', 'color': None, 'visible': True},
        {'id': 'library', 'title': 'Virtual Library', 'icon': 'fas fa-book', 'color': None, 'visible': True},
        {'id': 'technique', 'title': 'Engineering Techniques', 'icon': 'fas fa-tools', 'color': None, 'visible': True},
        {'id': 'profile', 'title': 'My Profile', 'icon': 'fas fa-user', 'color': None, 'visible': True}
    ]
}

@app.route('/admin-chat', methods=['POST'])
def admin_chat():
    """Main endpoint for admin chat interactions"""
    try:
        data = request.json
        message = data.get('message', '')
        profile = data.get('profile', 'student')
        current_layout = data.get('current_layout', {'cards': [], 'deletedCards': []})
        conversation_history = data.get('conversation_history', [])

        response = analyze_admin_prompt(message, profile, current_layout)
        
        response['timestamp'] = datetime.now().isoformat()
        response['profile'] = profile
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error in admin chat: {e}")
        return jsonify({
            "message": "An error occurred while processing your request.",
            "error": str(e),
            "action": "error"
        }), 500

def analyze_admin_prompt(prompt, profile, current_layout):
    """Analyze the admin's prompt and return appropriate action"""
    prompt_lower = prompt.lower()
    
    if any(keyword in prompt_lower for keyword in ['show', 'display', 'list', 'current']) and \
       any(keyword in prompt_lower for keyword in ['layout', 'cards', 'dashboard']):
        if profile == 'doctoral':
            return handle_show_layout(current_layout.get('cards', []), profile)
        return handle_show_layout(current_layout.get('cards', []), profile)
    
    add_match = re.search(r'(?:add|create)\s+(?:a\s+)?(?:new\s+)?(.+?)\s*(?:card|element|section)?$', prompt_lower)
    if add_match:
        element_name = add_match.group(1).strip()
        if profile == 'doctoral':
            existing_titles = [
                'Dashboard', 'Research', 'Internships', 'Virtual Library', 
                'Engineering Techniques', 'My Profile'
            ]
            return handle_add_element(element_name, existing_titles, profile)
        return handle_add_element(element_name, ['My Courses', 'Pending Assignments to Grade', 'Upload New Course Material', 'Virtual Library'], profile)
    
    delete_match = re.search(r'(?:delete|remove|hide)\s+(?:the\s+)?(.+?)(?:\s+card)?$', prompt_lower)
    if delete_match:
        element_name = delete_match.group(1).strip()
        if profile == 'doctoral':
            existing_titles = [
                'Dashboard', 'Research', 'Internships', 'Virtual Library', 
                'Engineering Techniques', 'My Profile'
            ]
            return handle_delete_element(element_name, existing_titles, profile)
        return handle_delete_element(element_name, ['My Courses', 'Pending Assignments to Grade', 'Upload New Course Material', 'Virtual Library'], profile)
    
    # Reset layout
    if any(keyword in prompt_lower for keyword in ['reset', 'restore', 'default']):
        return handle_reset_layout(profile)
    
    return get_help_message(profile)

def handle_show_layout(current_cards, profile):
    """Show current layout"""
    if profile == 'doctoral':
        default_cards = [
            {'id': 'dashboard', 'title': 'Dashboard', 'icon': 'fas fa-tachometer-alt', 'color': None, 'visible': True},
            {'id': 'research', 'title': 'Research', 'icon': 'fas fa-microscope', 'color': None, 'visible': True},
            {'id': 'stages', 'title': 'Internships', 'icon': 'fas fa-briefcase', 'color': None, 'visible': True},
            {'id': 'library', 'title': 'Virtual Library', 'icon': 'fas fa-book', 'color': None, 'visible': True},
            {'id': 'technique', 'title': 'Engineering Techniques', 'icon': 'fas fa-tools', 'color': None, 'visible': True},
            {'id': 'profile', 'title': 'My Profile', 'icon': 'fas fa-user', 'color': None, 'visible': True}
        ]
        current_cards = current_cards if current_cards else default_cards

    visible_cards = [card for card in current_cards if card.get('visible', True)]
    if not visible_cards:
        return {
            "action": "show_layout",
            "message": f"Your {profile.title()} dashboard is currently empty. You can add cards using commands like 'Add new [card name]'."
        }
    
    card_list = []
    for i, card in enumerate(visible_cards, 1):
        color_info = f" (Color: {card.get('color', 'default')})" if card.get('color') else ""
        icon_info = f" [{card.get('icon', 'fas fa-cube')}]"
        card_list.append(f"{i}. {card['title']}{color_info}{icon_info}")
    
    card_text = "\n".join(card_list)
    return {
        "action": "show_layout",
        "message": f"Current {profile.title()} Dashboard Layout:\n\n{card_text}\n\nTotal: {len(visible_cards)} cards"
    }

def handle_delete_element(element_name, existing_titles, profile):
    """Handle delete element request"""
    element_lower = element_name.lower()
    existing_lower = [title.lower() for title in existing_titles]
    
    # Find the original case version of the title
    original_title = None
    for title in existing_titles:
        if title.lower() == element_lower:
            original_title = title
            break
    
    if not original_title:
        if existing_titles:
            closest_match, score = process.extractOne(element_name, existing_titles)
            if score > 70:
                return {
                    "action": "clarify_delete",
                    "original_element": element_name,
                    "suggested_element": closest_match,
                    "message": f"I couldn't find '{element_name}'. Did you mean '{closest_match}'?",
                    "profile": profile
                }
        
        return {
            "action": "element_not_found",
            "element": element_name,
            "message": f"I couldn't find '{element_name}' in your {profile} dashboard. Use 'show layout' to see available cards.",
            "profile": profile
        }
    
    return {
        "action": "delete_element",
        "element": original_title,
        "message": f"Removing '{original_title}' from your {profile} dashboard.",
        "profile": profile,
        "trigger_update": True
    }

def handle_add_element(element_name, existing_titles, profile):
    """Handle add element request"""
    element_lower = element_name.lower()
    existing_lower = [title.lower() for title in existing_titles]
    
    if element_lower in existing_lower:
        original_title = None
        for title in existing_titles:
            if title.lower() == element_lower:
                original_title = title
                break
                
        return {
            "action": "duplicate_element",
            "element": original_title,
            "message": f"'{original_title}' already exists in your {profile} dashboard.",
            "profile": profile
        }

    element_name = ' '.join(word.capitalize() for word in element_name.split())
    
    icon_type = detect_icon_type(element_name)
    return {
        "action": "add_element",
        "element": {
            "id": element_name.lower().replace(" ", "-"),
            "title": element_name,
            "icon": icon_type,
            "color": None,
            "visible": True
        },
        "message": f"Adding '{element_name}' card to your {profile} dashboard.",
        "profile": profile,
        "trigger_update": True
    }

def handle_swap_elements(item1, item2, existing_titles, profile):
    """Handle swap elements request"""
    missing_items = []
    
    for item in [item1, item2]:
        if item.lower() not in existing_titles:
            missing_items.append(item)
    
    if missing_items:
        missing_text = " and ".join(missing_items)
        return {
            "action": "elements_not_found",
            "missing_elements": missing_items,
            "message": f"I couldn't find {missing_text} in your {profile} dashboard. Use 'show layout' to see available cards.",
            "profile": profile
        }
    
    return {
        "action": "swap_elements",
        "elements": [item1, item2],
        "message": f"Swapping positions of '{item1}' and '{item2}' in your {profile} dashboard.",
        "profile": profile
    }

def handle_change_color(element, color, existing_titles, profile):
    """Handle change color request"""
    if element.lower() not in existing_titles:
        if existing_titles:
            closest_match, score = process.extractOne(element, existing_titles)
            if score > 70:
                return {
                    "action": "clarify_color",
                    "original_element": element,
                    "suggested_element": closest_match,
                    "color": color,
                    "message": f"I couldn't find '{element}'. Did you mean '{closest_match}'?",
                    "profile": profile
                }
        
        return {
            "action": "element_not_found",
            "element": element,
            "message": f"I couldn't find '{element}' in your {profile} dashboard. Use 'show layout' to see available cards.",
            "profile": profile
        }
    
    return {
        "action": "change_color",
        "element": element,
        "color": color,
        "message": f"Changing '{element}' color to {color} in your {profile} dashboard.",
        "profile": profile
    }

def handle_move_element(element, position, existing_titles, profile):
    """Handle move element request"""
    if element.lower() not in existing_titles:
        return {
            "action": "element_not_found",
            "element": element,
            "message": f"I couldn't find '{element}' in your {profile} dashboard.",
            "profile": profile
        }
    
    if position.lower() not in existing_titles:
        return {
            "action": "element_not_found",
            "element": position,
            "message": f"I couldn't find '{position}' in your {profile} dashboard.",
            "profile": profile
        }
    
    return {
        "action": "move_element",
        "element": element,
        "position": position,
        "message": f"Moving '{element}' to position of '{position}' in your {profile} dashboard.",
        "profile": profile
    }

def handle_toggle_visibility(element, visible, existing_titles, profile):
    """Handle toggle visibility request"""
    if element.lower() not in existing_titles:
        return {
            "action": "element_not_found",
            "element": element,
            "message": f"I couldn't find '{element}' in your {profile} dashboard.",
            "profile": profile
        }
    
    action_text = "Showing" if visible else "Hiding"
    return {
        "action": "toggle_visibility",
        "element": element,
        "visible": visible,
        "message": f"{action_text} '{element}' in your {profile} dashboard.",
        "profile": profile
    }

def handle_reset_layout(profile):
    """Handle reset layout request"""
    return {
        "action": "reset_layout",
        "profile": profile,
        "message": f"Resetting {profile} dashboard to default layout.",
        "default_layout": DEFAULT_LAYOUTS.get(profile, [])
    }

def detect_icon_type(element_name):
    """Detect the appropriate icon for an element"""
    element_lower = element_name.lower()
    
    for key in ICON_MAP:
        if key in element_lower and key != 'default':
            return ICON_MAP[key]
    
    return ICON_MAP['default']

def get_help_message(profile):
    """Generate help message for the profile"""
    if profile == 'doctoral':
        return {
            "action": "help",
            "message": """I can help you manage your dashboard layout. Try these commands:

            • show layout - See your current dashboard sections
            • add [section name] - Add a new section
            • remove [section name] - Remove a section
            • reset layout - Restore default layout

            Available sections:
            - Dashboard
            - Research
            - Internships
            - Virtual Library
            - Engineering Techniques
            - My Profile""",
            "profile": profile
        }
    
    profile_examples = {
        'student': [
            "Add new Exams card",
            "Remove Library card", 
            "Change Grades color to blue",
            "Swap My Cursus an Announcements",
            "Show current layout"
        ],
        'teacher': [
            "Add Attendance card",
            "Remove Reports section",
            "Change Gradebook color to green", 
            "Move Lesson Plans after My Classes",
            "Show current layout"
        ],
        'ats': [
            "Add Monitoring card",
            "Delete Maintenance section",
            "Change Server Status color to red",
            "Swap User Management and Security Logs",
            "Display current layout"
        ],
        'doctoral': [
            "Add Bibliography card",
            "Remove Research section",
            "Change Virtual Library color to purple",
            "Swap Internships and Research",
            "Show layout status"
        ]
    }
    
    examples = profile_examples.get(profile, profile_examples['student'])
    example_text = "\n".join([f"• {example}" for example in examples])
    
    return {
        "action": "help",
        "message": f"I can help you customize your {profile.title()} dashboard. Try these commands:\n\n{example_text}\n\nI understand natural language, so feel free to ask in your own words!",
        "profile": profile
    }

def handle_add_nav_item(item_name, existing_items, profile):
    """Handle adding a navigation item"""
    if item_name.lower() in [item.lower() for item in existing_items]:
        return {
            "action": "duplicate_nav_item",
            "item": item_name,
            "message": f"'{item_name}' already exists in the navigation menu.",
            "profile": profile
        }
    
    return {
        "action": "add_nav_item",
        "item": {
            "id": item_name.lower().replace(" ", "-"),
            "title": item_name,
            "href": f"#{item_name.lower().replace(' ', '-')}",
            "active": False
        },
        "message": f"Adding '{item_name}' to the navigation menu.",
        "profile": profile
    }

def handle_delete_nav_item(item_name, existing_items, profile):
    """Handle deleting a navigation item"""
    if item_name.lower() not in [item.lower() for item in existing_items]:
        return {
            "action": "nav_item_not_found",
            "item": item_name,
            "message": f"I couldn't find '{item_name}' in the navigation menu. Use 'show nav' to see available items.",
            "profile": profile
        }
    
    return {
        "action": "delete_nav_item",
        "item": item_name,
        "message": f"Removing '{item_name}' from the navigation menu.",
        "profile": profile
    }

def get_nav_layout(profile):
    """Get the default navigation layout for a profile"""
    nav_layouts = {
        'teacher': {
            'items': [
                {'id': 'dashboard', 'title': 'Dashboard', 'href': '#dashboard', 'active': True},
                {'id': 'courses', 'title': 'My Courses', 'href': '#courses', 'active': False},
                {'id': 'students', 'title': 'Students', 'href': '#students', 'active': False},
                {'id': 'messages', 'title': 'Messages', 'href': '#messages', 'active': False},
                {'id': 'library', 'title': 'Virtual Library', 'href': '#library', 'active': False}
            ],
            'deletedItems': []
        }
    }
    return nav_layouts.get(profile, {'items': [], 'deletedItems': []})

if __name__ == '__main__':
    print("Starting Admin API Server...")
    print("Available endpoints:")
    print("- POST /admin-chat - Main admin chat interface")
    print("\nServer will be available at: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)