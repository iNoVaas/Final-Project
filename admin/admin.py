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
        {'id': 'research-project', 'title': 'Research Project', 'icon': 'fas fa-microscope', 'color': None, 'visible': True},
        {'id': 'literature-review', 'title': 'Literature Review', 'icon': 'fas fa-book-reader', 'color': None, 'visible': True},
        {'id': 'data-analysis', 'title': 'Data Analysis', 'icon': 'fas fa-chart-area', 'color': None, 'visible': True},
        {'id': 'thesis-writing', 'title': 'Thesis Writing', 'icon': 'fas fa-pen-fancy', 'color': None, 'visible': True},
        {'id': 'publications', 'title': 'Publications', 'icon': 'fas fa-newspaper', 'color': None, 'visible': True},
        {'id': 'conferences', 'title': 'Conferences', 'icon': 'fas fa-users', 'color': None, 'visible': True},
        {'id': 'supervisor-meetings', 'title': 'Supervisor Meetings', 'icon': 'fas fa-handshake', 'color': None, 'visible': True},
        {'id': 'resources', 'title': 'Research Resources', 'icon': 'fas fa-archive', 'color': None, 'visible': True}
    ]
}

@app.route('/admin-chat', methods=['POST'])
def admin_chat():
    """
    Main endpoint for admin chat interactions
    Handles layout modification commands for different profiles
    """
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
    """
    Analyze the admin's prompt and return appropriate action
    """
    prompt_lower = prompt.lower()
    current_cards = current_layout.get('cards', [])
    existing_titles = [card['title'].lower() for card in current_cards if card.get('visible', True)]
    
    if any(keyword in prompt_lower for keyword in ['show', 'display', 'list', 'current']) and \
       any(keyword in prompt_lower for keyword in ['layout', 'cards', 'dashboard']):
        return handle_show_layout(current_cards, profile)
    
    delete_match = re.search(r'(delete|remove|hide)\s+(?:the\s+)?(.+?)(?:\s+card)?$', prompt_lower)
    if delete_match:
        element_name = delete_match.group(2).strip()
        return handle_delete_element(element_name, existing_titles, profile)

    add_match = re.search(r'(?:add|create)\s+(?:a\s+)?(?:new\s+)?(.+?)\s*(?:card|element|section)?$', prompt_lower)
    if add_match:
        element_name = add_match.group(1).strip()
        return handle_add_element(element_name, existing_titles, profile)
    
    swap_match = re.search(r'(swap|switch|exchange)\s+(.+?)\s+(?:and|with)\s+(.+)', prompt_lower)
    if swap_match:
        item1, item2 = swap_match.groups()[1:]
        return handle_swap_elements(item1.strip(), item2.strip(), existing_titles, profile)
    
    color_match = re.search(r'(change|make|set)\s+(.+?)\s+(?:color\s+)?(?:to|as)\s+(red|blue|green|yellow|purple|orange|pink)', prompt_lower)
    if color_match:
        element, color = color_match.groups()[1:]
        return handle_change_color(element.strip(), color.strip(), existing_titles, profile)
    
    move_match = re.search(r'(move|position)\s+(.+?)\s+(?:to|after|before)\s+(.+)', prompt_lower)
    if move_match:
        element, position = move_match.groups()[1:]
        return handle_move_element(element.strip(), position.strip(), existing_titles, profile)
    
    visibility_match = re.search(r'(hide|show|display)\s+(.+)', prompt_lower)
    if visibility_match:
        action, element = visibility_match.groups()
        return handle_toggle_visibility(element.strip(), action.strip() == "show", existing_titles, profile)
    
    if any(keyword in prompt_lower for keyword in ['reset', 'restore', 'default']):
        return handle_reset_layout(profile)
    
    return get_help_message(profile)

def handle_show_layout(current_cards, profile):
    """Show current layout"""
    visible_cards = [card for card in current_cards if card.get('visible', True)]
    if not visible_cards:
        return {
            "action": "show_layout",
            "message": f"Your {profile.title()} dashboard is currently empty. You can add cards using commands like 'Add new [card name]'."
        }
    
    card_list = []
    for i, card in enumerate(visible_cards, 1):
        color_info = f" (Color: {card.get('color', 'default')})" if card.get('color') else ""
        card_list.append(f"{i}. {card['title']}{color_info}")
    
    card_text = "\n".join(card_list)
    return {
        "action": "show_layout",
        "message": f"Current {profile.title()} Dashboard Layout:\n\n{card_text}\n\nTotal: {len(visible_cards)} cards"
    }

def handle_delete_element(element_name, existing_titles, profile):
    """Handle delete element request"""
    if element_name.lower() not in existing_titles:
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
        "element": element_name,
        "message": f"Removing '{element_name}' from your {profile} dashboard.",
        "profile": profile
    }

def handle_add_element(element_name, existing_titles, profile):
    """Handle add element request"""
    if element_name.lower() in existing_titles:
        return {
            "action": "duplicate_element",
            "element": element_name,
            "message": f"'{element_name}' already exists in your {profile} dashboard.",
            "profile": profile
        }

    if existing_titles:
        closest_match, score = process.extractOne(element_name, existing_titles)
        if score > 70:
            return {
                "action": "clarify_add",
                "original_element": element_name,
                "suggested_element": closest_match,
                "message": f"'{element_name}' is similar to existing '{closest_match}'. Do you want to add it anyway?",
                "profile": profile
            }
    
    icon_type = detect_icon_type(element_name)
    return {
        "action": "add_element",
        "element": element_name,
        "icon": icon_type,
        "message": f"Adding '{element_name}' card to your {profile} dashboard.",
        "profile": profile
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
    profile_examples = {
        'student': [
            "Add new Exams card",
            "Remove Library card", 
            "Change Grades color to blue",
            "Swap My Cursus and Announcements",
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
            "Remove Conferences section", 
            "Change Data Analysis color to purple",
            "Move Thesis Writing before Publications",
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

@app.route('/get-default-layout', methods=['POST'])
def get_default_layout():
    """Get default layout for a specific profile"""
    try:
        data = request.json
        profile = data.get('profile', 'student')
        
        if profile not in DEFAULT_LAYOUTS:
            return jsonify({
                "error": "Invalid profile",
                "message": f"Profile '{profile}' not found"
            }), 400
        
        return jsonify({
            "profile": profile,
            "layout": DEFAULT_LAYOUTS[profile],
            "message": f"Default layout for {profile.title()} profile"
        })
    
    except Exception as e:
        return jsonify({
            "error": "Server error",
            "message": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Admin API is running",
        "timestamp": datetime.now().isoformat(),
        "available_profiles": list(DEFAULT_LAYOUTS.keys())
    })

@app.route('/profiles', methods=['GET'])
def get_profiles():
    """Get available profiles and their default layouts"""
    return jsonify({
        "profiles": {
            "student": {
                "name": "Student",
                "icon": "🎓",
                "description": "Academic assistance and learning support",
                "default_cards": len(DEFAULT_LAYOUTS['student'])
            },
            "teacher": {
                "name": "Teacher", 
                "icon": "👨‍🏫",
                "description": "Educational tools and curriculum development",
                "default_cards": len(DEFAULT_LAYOUTS['teacher'])
            },
            "ats": {
                "name": "ATS",
                "icon": "⚙️", 
                "description": "Administrative and technical support",
                "default_cards": len(DEFAULT_LAYOUTS['ats'])
            },
            "doctoral": {
                "name": "Doctoral",
                "icon": "🔬",
                "description": "Advanced research assistance",
                "default_cards": len(DEFAULT_LAYOUTS['doctoral'])
            }
        }
    })

if __name__ == '__main__':
    print("Starting Admin API Server...")
    print("Available endpoints:")
    print("- POST /admin-chat - Main admin chat interface")
    print("- POST /get-default-layout - Get default layout for profile")
    print("- GET /health - Health check")
    print("- GET /profiles - Get available profiles")
    print("\nServer will be available at: http://localhost:5000")
    print("Make sure to install required packages:")
    print("pip install flask flask-cors fuzzywuzzy python-levenshtein")
    
    app.run(host='0.0.0.0', port=5000, debug=True)