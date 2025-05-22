from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from bs4 import BeautifulSoup
from fuzzywuzzy import process

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
    'message': 'fas fa-envelope',
    'profile': 'fas fa-user',
    'dashboard': 'fas fa-tachometer-alt',
    'default': 'fas fa-cube'
}

@app.route('/process-prompt', methods=['POST'])
def process_prompt():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        current_html = data.get('current_html', '')

        response = analyze_prompt(prompt, current_html)
        return jsonify(response)
    except Exception as e:
        print(f"Error processing prompt: {e}")
        return jsonify({
            "message": "An error occurred while processing your request.",
            "error": str(e)
        }), 500

def analyze_prompt(prompt, current_html):
    prompt_lower = prompt.lower()
    soup = BeautifulSoup(current_html, 'html.parser')
    existing_cards = [h3.text.lower() for h3 in soup.find_all('h3')]

    delete_match = re.search(r'(delete|remove)\s+(?:the\s+)?(.+?)(?:\s+card)?$', prompt_lower)
    if delete_match:
        element_name = delete_match.group(2).strip()
        if element_name.lower() not in existing_cards:
            closest_match, score = process.extractOne(element_name, existing_cards)
            if score > 70:
                return {
                    "action": "clarify_delete",
                    "original_element": element_name,
                    "suggested_element": closest_match,
                    "message": f"Did you mean '{closest_match}' instead of '{element_name}'?",
                    "yes_no_options": True
                }
            else:
                return {
                    "action": "offer_create",
                    "element": element_name,
                    "message": f"'{element_name}' doesn't exist. Would you like to create it?",
                    "yes_no_options": True
                }
        return {
            "action": "delete_element",
            "element": element_name,
            "message": f"Deleting {element_name} card."
        }

    add_match = re.search(r'(?:add|create)\s+(?:a\s+)?(?:new\s+)?(.+?)\s*(?:card|element|section)?$', prompt_lower)
    if add_match:
        element_name = add_match.group(1).strip()
        closest_match, score = process.extractOne(element_name, existing_cards)

        if element_name.lower() in existing_cards:
            return {
                "action": "duplicate_element",
                "element": element_name,
                "message": f"'{element_name}' already exists."
            }
        elif score > 70:
            return {
                "action": "clarify_add",
                "original_element": element_name,
                "suggested_element": closest_match,
                "message": f"Did you mean '{closest_match}' instead of '{element_name}'?",
                "yes_no_options": True
            }
        else:
            icon_type = detect_icon_type(element_name)
            return {
                "action": "add_element",
                "element": element_name,
                "icon": icon_type,
                "message": f"Adding new card for {element_name}."
            }

    swap_match = re.search(r'(swap|switch|exchange)\s+(.+?)\s+(?:and|with)\s+(.+)', prompt_lower)
    if swap_match:
        item1, item2 = swap_match.groups()[1:]
        item1 = item1.strip()
        item2 = item2.strip()

        responses = []
        for item in [item1, item2]:
            if item.lower() not in existing_cards:
                closest_match, score = process.extractOne(item, existing_cards)
                if score > 70:
                    responses.append({
                        "action": "clarify_swap",
                        "original_element": item,
                        "suggested_element": closest_match,
                        "message": f"Did you mean '{closest_match}' instead of '{item}'?",
                        "yes_no_options": True
                    })
                else:
                    responses.append({
                        "action": "offer_create_swap",
                        "element": item,
                        "message": f"'{item}' doesn't exist. Would you like to create it?",
                        "yes_no_options": True
                    })

        if responses:
            return responses[0] if len(responses) == 1 else {
                "action": "multiple_issues",
                "issues": responses,
                "message": "I found some issues with the items you mentioned."
            }

        return {
            "action": "swap_elements",
            "elements": [item1, item2],
            "message": f"I'll swap {item1} and {item2}."
        }

    color_match = re.search(r'(change|make|set)\s+(.+?)\s+(?:to|as)\s+(red|blue|green|yellow|purple|orange|pink)', prompt_lower)
    if color_match:
        element, color = color_match.groups()[1:]
        return {
            "action": "change_color",
            "element": element.strip(),
            "color": color.strip(),
            "message": f"Changing {element} to {color}."
        }

    move_match = re.search(r'(move|position)\s+(.+?)\s+(?:to|after|before)\s+(.+)', prompt_lower)
    if move_match:
        element, position = move_match.groups()[1:]
        return {
            "action": "move_element",
            "element": element.strip(),
            "position": position.strip(),
            "message": f"Moving {element} to {position}."
        }

    visibility_match = re.search(r'(hide|show|display)\s+(.+)', prompt_lower)
    if visibility_match:
        action, element = visibility_match.groups()
        return {
            "action": "toggle_visibility",
            "element": element.strip(),
            "visible": action.strip() == "show",
            "message": f"{'Showing' if action == 'show' else 'Hiding'} {element}."
        }

    return {
        "message": "I can help modify the layout. Try commands like:\n" +
                   "- 'Add new Exams card'\n" +
                   "- 'Delete Settings card'\n" +
                   "- 'Swap My Cursus and Announcements'\n" +
                   "- 'Change color of Library to purple'\n" +
                   "- 'Move Grades before Assignments'"
    }

def detect_icon_type(element_name):
    element_lower = element_name.lower()
    for key in ICON_MAP:
        if key in element_lower and key != 'default':
            return ICON_MAP[key]
    return ICON_MAP['default']

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Server will be available at: http://localhost:5000")
    app.run(port=5000, debug=True)