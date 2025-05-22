from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from bs4 import BeautifulSoup

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
    
    delete_match = re.search(r'(delete|remove)\s+(?:the\s+)?(.+?)(?:\s+card)?$', prompt_lower)
    if delete_match:
        element_name = delete_match.group(2).strip()
        return {
            "action": "delete_element",
            "element": element_name,
            "message": f"Deleting {element_name} card."
        }
    
    add_match = re.search(r'(?:add|create)\s+(?:a\s+)?(?:new\s+)?(.+?)\s*(?:card|element|section)?$', prompt_lower)
    if add_match:
        element_name = add_match.group(1).strip()
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
        return {
            "action": "swap_elements",
            "elements": [item1.strip(), item2.strip()],
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