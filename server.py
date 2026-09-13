import json
import os
import time
import threading
from collections import deque
from functools import wraps
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import bcrypt
import jwt

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')
DATA_LOCK = threading.RLock()
VOICE_LANGUAGE_IDS = {'en', 'hi', 'pa', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml'}
INTERFACE_LANGUAGE_IDS = {'en', 'hi'}
SPEECH_SPEEDS = {'slow', 'normal', 'fast'}
JWT_SECRET = os.environ.get('SMRITI_JWT_SECRET', 'smritisaathi-dev-secret-change-me')
JWT_ALGORITHM = 'HS256'
DEV_CAREGIVER_PASSWORD = 'SmritiSaathi2026!'

DEFAULT_DATA = {
    "patient": {
        "id": "pat_001",
        "name": "Devendra Sharma",
        "preferred_name": "Devendra Ji",
        "age": 72,
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces",
        "region": "Delhi / NCR",
        "language": "Hindi & English",
        "bio": "Retired railway engineer who loves morning tea on the balcony, Ghazals, and playing with his grandson.",
        "streak_days": 5,
        "total_sessions_completed": 18,
        "current_session_done_today": False,
        "last_session_date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
        "onboarding_completed": True,
        "settings": {
            "font_size": "large",
            "voice_guidance": True,
            "interface_language": "en",
            "voice_language": "hi",
            "voice_enabled": True,
            "auto_read_aloud": False,
            "speech_speed": "normal",
            "sound_effects": True,
            "high_contrast": False,
            "theme": "pastel_warm"
        }
    },
    "caregiver": {
        "id": "cg_001",
        "name": "Dr. Ananya Sharma",
        "relationship": "Daughter",
        "phone": "+91 98765 43210",
        "email": "ananya.sharma@example.com",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces",
        "role": "Primary Caregiver & Neurologist"
    },
    "users": [
        {"id": "cg_001", "email": "ananya.sharma@example.com", "password_hash": "", "role": "caregiver"},
        {"id": "pat_001", "role": "patient"}
    ],
    "home_locations": [],
    "home_connections": [],
    "familiar_objects": [],
    "assistance_events": [],
    "family_members": [
        {
            "id": "fam_1",
            "name": "Rohan",
            "full_name": "Rohan Sharma",
            "relationship": "Grandson",
            "nickname": "Chintu",
            "photo": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=faces",
            "familiarity_notes": "Studies computer science in Delhi. Visits every Sunday evening.",
            "favorite_activity": "Playing chess and talking about trains",
            "times_recognized": 24,
            "last_recognized": "Yesterday"
        },
        {
            "id": "fam_2",
            "name": "Priya",
            "full_name": "Dr. Priya Sharma",
            "relationship": "Daughter",
            "nickname": "Guddi",
            "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
            "familiarity_notes": "Lives nearby in South Delhi. Calls every morning at 9:00 AM.",
            "favorite_activity": "Sharing herbal morning tea and old family recipes",
            "times_recognized": 28,
            "last_recognized": "Today"
        },
        {
            "id": "fam_3",
            "name": "Ankit",
            "full_name": "Ankit Sharma",
            "relationship": "Son",
            "nickname": "Chhotu",
            "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
            "familiarity_notes": "Architect living in Bangalore. Video calls on weekends.",
            "favorite_activity": "Showing new building designs and vintage blueprints",
            "times_recognized": 19,
            "last_recognized": "3 days ago"
        },
        {
            "id": "fam_4",
            "name": "Meera",
            "full_name": "Meera Sharma",
            "relationship": "Beloved Wife",
            "nickname": "Meeru",
            "photo": "https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&h=400&fit=crop&crop=faces",
            "familiarity_notes": "Married for 46 wonderful years. Loved gardening roses and classical harmonium.",
            "favorite_activity": "Listening to old Mohammad Rafi ghazals",
            "times_recognized": 32,
            "last_recognized": "2 days ago"
        },
        {
            "id": "fam_5",
            "name": "Aarav",
            "full_name": "Aarav Sharma",
            "relationship": "Great-Nephew",
            "nickname": "Bablu",
            "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=faces",
            "familiarity_notes": "7 years old. Loves drawing cricket bats and airplanes for grandpa.",
            "favorite_activity": "Reading picture storybooks together",
            "times_recognized": 15,
            "last_recognized": "4 days ago"
        }
    ],
    "routines": [
        {
            "id": "rt_morning",
            "category": "Morning Routine",
            "period": "Morning (7:00 AM - 10:00 AM)",
            "icon": "Sun",
            "color": "amber",
            "steps": [
                {"id": "m1", "title": "Wake up gently & drink warm water", "time": "7:00 AM", "icon": "GlassWater", "completed": True},
                {"id": "m2", "title": "Brush teeth & freshen up", "time": "7:30 AM", "icon": "Sparkles", "completed": True},
                {"id": "m3", "title": "Gentle balcony walk & deep breathing", "time": "8:00 AM", "icon": "Footprints", "completed": True},
                {"id": "m4", "title": "Take morning blood pressure tablet", "time": "8:30 AM", "icon": "Pill", "completed": True},
                {"id": "m5", "title": "Warm breakfast: Poha & mild ginger tea", "time": "9:00 AM", "icon": "UtensilsCrossed", "completed": False}
            ]
        },
        {
            "id": "rt_afternoon",
            "category": "Afternoon Routine",
            "period": "Afternoon (12:00 PM - 3:00 PM)",
            "icon": "SunMedium",
            "color": "blue",
            "steps": [
                {"id": "a1", "title": "Light nutritious lunch & fresh curd", "time": "1:00 PM", "icon": "Utensils", "completed": False},
                {"id": "a2", "title": "Take afternoon multivitamin", "time": "1:45 PM", "icon": "Pill", "completed": False},
                {"id": "a3", "title": "Relaxing afternoon rest / Ghazal music", "time": "2:00 PM", "icon": "Music", "completed": False},
                {"id": "a4", "title": "SmritiSaathi wellness session", "time": "3:30 PM", "icon": "Brain", "completed": False}
            ]
        },
        {
            "id": "rt_evening",
            "category": "Evening Routine",
            "period": "Evening (6:00 PM - 9:30 PM)",
            "icon": "Moon",
            "color": "indigo",
            "steps": [
                {"id": "e1", "title": "Evening herbal tea & family phone call", "time": "6:00 PM", "icon": "PhoneCall", "completed": False},
                {"id": "e2", "title": "Light home dinner with family", "time": "8:00 PM", "icon": "Utensils", "completed": False},
                {"id": "e3", "title": "Night heart & cholesterol medicine", "time": "8:45 PM", "icon": "Pill", "completed": False},
                {"id": "e4", "title": "Soothing bedtime reading & good sleep", "time": "9:30 PM", "icon": "BedDouble", "completed": False}
            ]
        }
    ],
    "reminders": [
        {
            "id": "rem_1",
            "type": "medication",
            "title": "Morning Blood Pressure Tablet",
            "description": "Take 1 tablet with a glass of warm water after light snack",
            "time": "08:30 AM",
            "icon": "Pill",
            "badge": "Medication",
            "completed": True,
            "due_period": "Morning"
        },
        {
            "id": "rem_2",
            "type": "cognitive",
            "title": "Today's Cognitive Wellness Session",
            "description": "Play 4 fun, familiar activities together",
            "time": "10:30 AM",
            "icon": "Brain",
            "badge": "Daily Activity",
            "completed": False,
            "due_period": "Morning"
        },
        {
            "id": "rem_3",
            "type": "meal",
            "title": "Time for Lunch",
            "description": "Warm yellow dal, roti, and fresh cucumber salad",
            "time": "01:00 PM",
            "icon": "UtensilsCrossed",
            "badge": "Meal",
            "completed": False,
            "due_period": "Afternoon"
        },
        {
            "id": "rem_4",
            "type": "family",
            "title": "Video Call with Daughter Priya",
            "description": "Priya loves seeing your smile and talking about family recipes",
            "time": "06:00 PM",
            "icon": "PhoneCall",
            "badge": "Family Time",
            "completed": False,
            "due_period": "Evening"
        },
        {
            "id": "rem_5",
            "type": "medication",
            "title": "Night Heart Medicine",
            "description": "1 tablet after dinner before sleep",
            "time": "08:45 PM",
            "icon": "Pill",
            "badge": "Medication",
            "completed": False,
            "due_period": "Night"
        }
    ],
    "cultural_preferences": {
        "region": "Delhi / Haryana",
        "languages": ["Hindi", "English"],
        "favorite_festivals": ["Diwali", "Holi", "Baisakhi", "Dussehra"],
        "favorite_foods": ["Aloo Paratha", "Poha", "Dal Makhani", "Kheer"],
        "favorite_music": ["Old Bollywood Classics", "Mohammad Rafi Ghazals", "Bhakti Bhajans"],
        "favorite_places": ["India Gate, New Delhi", "Lodhi Garden", "Shimla Hills", "Chandni Chowk"],
        "traditional_objects": ["Diya (🪔)", "Clay Chai Kulhad (🍵)", "Dholak (🥁)", "Brass Bell (🔔)"]
    },
    "skill_profile": {
        "recognition": {
            "name": "Familiar Recognition",
            "level": 3,
            "accuracy_pct": 92,
            "trend": "up",
            "hints_avg": 0.4,
            "description": "Exceptional familiarity identifying grandson Rohan, daughter Priya, and close relatives."
        },
        "memory": {
            "name": "Remember & Recall",
            "level": 2,
            "accuracy_pct": 68,
            "trend": "stable",
            "hints_avg": 1.4,
            "description": "Benefits from visual association and gentle hints when recalling 4+ objects."
        },
        "attention": {
            "name": "Focus & Attention",
            "level": 3,
            "accuracy_pct": 85,
            "trend": "up",
            "hints_avg": 0.3,
            "description": "High focus during colorful target spotting with prompt reaction times."
        },
        "sequencing": {
            "name": "Daily Routine & Order",
            "level": 3,
            "accuracy_pct": 88,
            "trend": "up",
            "hints_avg": 0.6,
            "description": "Consistent ordering of daily morning steps, brushing, bathing, and meals."
        },
        "semantic": {
            "name": "Match & Associate",
            "level": 3,
            "accuracy_pct": 82,
            "trend": "stable",
            "hints_avg": 0.7,
            "description": "Strong associations between family members, common household tools, and their uses."
        },
        "language": {
            "name": "Words & Language",
            "level": 3,
            "accuracy_pct": 79,
            "trend": "stable",
            "hints_avg": 0.8,
            "description": "Quickly completes common words, opposites, and everyday object naming."
        },
        "culture": {
            "name": "Culture & Familiarity",
            "level": 4,
            "accuracy_pct": 95,
            "trend": "up",
            "hints_avg": 0.2,
            "description": "Deep autobiographical warmth with festive traditions, regional food, and melodies."
        },
        "reasoning": {
            "name": "Sequence & Reasoning",
            "level": 2,
            "accuracy_pct": 71,
            "trend": "stable",
            "hints_avg": 1.2,
            "description": "Comfortable with step patterns (2, 4, 6) and daily logic with supportive reassurance."
        }
    },
    "alerts": [
        {
            "id": "alt_1",
            "severity": "info",
            "title": "Positive Memory Milestone",
            "message": "Devendra recognized grandson Rohan in under 3.2 seconds without any hints today! ❤️",
            "timestamp": "Today, 10:45 AM",
            "action_taken": "Reinforced positive feedback & awarded recognition badge."
        },
        {
            "id": "alt_2",
            "severity": "gentle_care",
            "title": "Gentle Practice Opportunity: Short-Term Recall",
            "message": "Needed 2 supportive hints on the 4-object recall challenge yesterday. Consider reminiscing with family photo albums tonight.",
            "timestamp": "Yesterday, 3:45 PM",
            "action_taken": "Recommendation engine scheduled visual association support for today's session."
        },
        {
            "id": "alt_3",
            "severity": "success",
            "title": "Routine Consistency",
            "message": "Devendra has maintained a 5-day streak of morning routine checks and medication adherence.",
            "timestamp": "2 days ago",
            "action_taken": "Caregiver notification sent."
        }
    ],
    "history_sessions": [
        {
            "session_id": "ses_01",
            "date": (datetime.now() - timedelta(days=4)).strftime("%Y-%m-%d"),
            "completed_activities": 4,
            "duration_minutes": 8,
            "encouragement": "Wonderful engagement with family photos!",
            "stars": 4,
            "skills_practiced": ["Recognition", "Culture", "Focus", "Routine"],
            "accuracy": 88
        },
        {
            "session_id": "ses_02",
            "date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
            "completed_activities": 4,
            "duration_minutes": 9,
            "encouragement": "Great focus during morning sequence games.",
            "stars": 4,
            "skills_practiced": ["Memory", "Words", "Routine", "Recognition"],
            "accuracy": 82
        },
        {
            "session_id": "ses_03",
            "date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
            "completed_activities": 4,
            "duration_minutes": 10,
            "encouragement": "Excellent recall of festive traditions and foods.",
            "stars": 5,
            "skills_practiced": ["Culture", "Recognition", "Match", "Attention"],
            "accuracy": 92
        },
        {
            "session_id": "ses_04",
            "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
            "completed_activities": 4,
            "duration_minutes": 9,
            "encouragement": "Consistent effort and gentle memory practice.",
            "stars": 4,
            "skills_practiced": ["Memory", "Reasoning", "Routine", "Recognition"],
            "accuracy": 84
        }
    ],
    "question_attempts_log": []
}

def load_data():
    if not os.path.exists(DATA_FILE):
        save_data(DEFAULT_DATA)
        return DEFAULT_DATA
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Keep older demo data compatible without overwriting user content.
            changed = False
            for key in ("home_locations", "home_connections", "familiar_objects", "assistance_events"):
                if key not in data:
                    data[key] = []
                    changed = True
            if "users" not in data:
                data["users"] = [
                    {"id": data.get("caregiver", {}).get("id", "cg_001"), "email": data.get("caregiver", {}).get("email", "ananya.sharma@example.com"), "password_hash": bcrypt.hashpw(DEV_CAREGIVER_PASSWORD.encode(), bcrypt.gensalt()).decode(), "role": "caregiver"},
                    {"id": data.get("patient", {}).get("id", "pat_001"), "role": "patient"}
                ]
                changed = True
            elif not next((u for u in data["users"] if u.get("role") == "caregiver"), {}).get("password_hash"):
                for user in data["users"]:
                    if user.get("role") == "caregiver":
                        user["password_hash"] = bcrypt.hashpw(DEV_CAREGIVER_PASSWORD.encode(), bcrypt.gensalt()).decode()
                        changed = True
            if changed:
                save_data(data)
            return data
    except Exception as e:
        print(f"Error loading data: {e}")
        return DEFAULT_DATA

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def data_locked(handler):
    """Serialize JSON read-modify-write handlers in this single-process app."""
    @wraps(handler)
    def wrapped(*args, **kwargs):
        with DATA_LOCK:
            return handler(*args, **kwargs)
    return wrapped

def create_token(user_id, role):
    return jwt.encode({"sub": user_id, "role": role, "exp": datetime.utcnow() + timedelta(hours=12)}, JWT_SECRET, algorithm=JWT_ALGORITHM)

def require_role(*roles):
    """Require a valid bearer token with one of the named application roles."""
    def decorator(handler):
        @wraps(handler)
        def wrapped(*args, **kwargs):
            header = request.headers.get("Authorization", "")
            if not header.startswith("Bearer "):
                return jsonify({"error": "Authentication required"}), 401
            try:
                claims = jwt.decode(header[7:], JWT_SECRET, algorithms=[JWT_ALGORITHM])
            except jwt.PyJWTError:
                return jsonify({"error": "Invalid or expired token"}), 401
            if claims.get("role") not in roles:
                return jsonify({"error": "You do not have permission for this action"}), 403
            request.auth = claims
            return handler(*args, **kwargs)
        return wrapped
    return decorator

class ObjectRecognitionService:
    """Conservative demo adapter. Replace this class when a real vision model is available."""
    def recognize(self, image, expected_object_id=None, objects=None):
        if expected_object_id:
            familiar = next((item for item in (objects or []) if item.get("id") == expected_object_id), None)
            if familiar:
                return {"name": familiar.get("name"), "confidence": 1.0, "familiar_object_id": familiar["id"]}
        return {"name": "uncertain", "confidence": 0.0, "familiar_object_id": None}

GAME_IDS = {
    "game_faces", "game_recall", "game_focus", "game_routine",
    "game_match", "game_words", "game_culture", "game_reasoning"
}

def local_day():
    """Use one server-local ISO date for all daily-session comparisons."""
    return datetime.now().strftime("%Y-%m-%d")

def build_daily_session(data):
    """Create the immutable plan once; later reads return this exact plan."""
    catalog_map = {g["id"]: g for g in json.loads(get_game_catalog().data)}
    game_ids = get_next_recommended_games(data)
    activities = []
    for index, game_id in enumerate(game_ids):
        game = catalog_map[game_id]
        activities.append({
            "order": index + 1, "game_id": game_id, "title": game["title"],
            "category": game["category"], "icon": game["icon"], "color": game["color"],
            "bg": game["bg"], "description": game["description"],
            "questions": generate_questions_for_game(game_id, data), "completed": False
        })
    return {
        "session_id": f"daily_{data['patient']['id']}_{local_day()}",
        "patient_id": data["patient"]["id"], "date": local_day(),
        "activities": activities, "current_activity_index": 0, "completed": False,
        "completed_at": None
    }

def get_or_create_daily_session(data):
    """Idempotent USER + DATE session creation, protected for concurrent requests."""
    today = local_day()
    session = data.get("daily_session")
    if not session or session.get("patient_id") != data["patient"]["id"] or session.get("date") != today:
        session = build_daily_session(data)
        # Preserve a legacy completed day when upgrading data that predates daily_session.
        legacy_completed = data["patient"].get("current_session_done_today") and data["patient"].get("last_session_date") == today
        if legacy_completed:
            for activity in session["activities"]:
                activity["completed"] = True
            session["current_activity_index"] = max(len(session["activities"]) - 1, 0)
            session["completed"] = True
        data["daily_session"] = session
        data["patient"]["current_session_done_today"] = bool(legacy_completed)
    return session

# ==========================================
# 3-TIER ADAPTIVE INTELLIGENCE ENGINE
# ==========================================

def get_next_recommended_games(data):
    """
    3rd Level Adaptation:
    Analyzes skill profile, weaker areas that need practice, recent games,
    and maintains engagement & variety.
    """
    skill_profile = data.get("skill_profile", {})
    
    # Sort skills by priority: lower accuracy / higher hints need more practice
    skills_sorted = sorted(
        skill_profile.items(),
        key=lambda item: item[1].get("accuracy_pct", 80)
    )
    
    needs_practice = skills_sorted[0][0]  # e.g., memory or reasoning
    secondary_practice = skills_sorted[1][0]

    skill_to_game = {
        "recognition": "game_faces",
        "memory": "game_recall",
        "attention": "game_focus",
        "sequencing": "game_routine",
        "semantic": "game_match",
        "language": "game_words",
        "culture": "game_culture",
        "reasoning": "game_reasoning"
    }

    session_game_ids = [
        "game_faces",
        "game_routine",
        skill_to_game.get(needs_practice, "game_recall"),
        "game_culture"
    ]
    seen = set()
    final_games = []
    for gid in session_game_ids:
        if gid not in seen:
            seen.add(gid)
            final_games.append(gid)

    if len(final_games) < 4:
        final_games.append(skill_to_game.get(secondary_practice, "game_focus"))

    return final_games

def generate_questions_for_game(game_id, data, current_level=2):
    """
    Generates tailored, question-by-question items with 3-tier progressive hints.
    """
    fam_list = data.get("family_members", [])
    patient = data.get("patient", {})
    cult = data.get("cultural_preferences", {})
    routines = data.get("routines", [])

    if game_id == "game_faces":
        # Game 1: Familiar Faces
        primary_member = fam_list[0] if fam_list else {
            "name": "Rohan", "relationship": "Grandson", "photo": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop"
        }
        options = [primary_member["name"]]
        for f in fam_list[1:4]:
            options.append(f["name"])
        while len(options) < 4:
            options.append("Kunal")
        
        correct = primary_member["name"]
        display_options = sorted(options[:4], key=lambda x: len(x))

        return [
            {
                "id": "gf_q1",
                "game_type": "recognition",
                "title": "Who is this familiar smiling person?",
                "subtitle": "Look at the photo and choose their name.",
                "image": primary_member["photo"],
                "options": display_options,
                "correct_answer": correct,
                "hints": [
                    f"💡 This person is a cherished member of your family.",
                    f"💡 This is your loving {primary_member['relationship'].lower()}.",
                    f"💡 Their name starts with the letter '{correct[0]}'."
                ],
                "explanation": f"Wonderful! You remembered {correct}, your loving {primary_member['relationship'].lower()}! ❤️",
                "audio_text": f"Who is this familiar smiling person? Look at the photo and choose their name."
            },
            {
                "id": "gf_q2",
                "game_type": "recognition",
                "title": f"What is your special relationship with {fam_list[1]['name']}?",
                "subtitle": "Tap the relationship that matches.",
                "image": fam_list[1]["photo"],
                "options": [fam_list[1]["relationship"], "Neighbor", "Assistant", "Teacher"],
                "correct_answer": fam_list[1]["relationship"],
                "hints": [
                    "💡 She is one of the closest members of your immediate family.",
                    f"💡 She calls you every morning to check on your health.",
                    f"💡 She is your loving {fam_list[1]['relationship']}."
                ],
                "explanation": f"Spot on! {fam_list[1]['name']} is your devoted {fam_list[1]['relationship']}. ❤️",
                "audio_text": f"What is your special relationship with {fam_list[1]['name']}?"
            }
        ]

    elif game_id == "game_recall":
        # Game 2: Remember & Recall
        return [
            {
                "id": "gr_q1",
                "game_type": "memory",
                "title": "Remember these 4 everyday items",
                "subtitle": "Look carefully at these objects. In a moment, they will hide!",
                "preview_duration_sec": 5,
                "display_items": [
                    {"name": "Apple", "emoji": "🍎"},
                    {"name": "Key", "emoji": "🔑"},
                    {"name": "Glasses", "emoji": "🕶️"},
                    {"name": "Chai Cup", "emoji": "☕"}
                ],
                "question": "Which of these objects was on the tray?",
                "options": ["Apple 🍎", "Train Ticket 🎫", "Umbrella ☂️", "Sunflower 🌻"],
                "correct_answer": "Apple 🍎",
                "hints": [
                    "💡 Think back to the fresh red fruit displayed on the left.",
                    "💡 It is sweet, crisp, and keeps the doctor away!",
                    "💡 It is an Apple 🍎."
                ],
                "explanation": "Great memory! You spotted the red apple 🍎 right away.",
                "audio_text": "Which of these objects did you just see on the tray?"
            },
            {
                "id": "gr_q2",
                "game_type": "memory",
                "title": "Recall the second item",
                "subtitle": "From the same collection of items you just viewed:",
                "preview_duration_sec": 0,
                "question": "Which everyday tool was on the tray to unlock doors?",
                "options": ["Key 🔑", "Hammer 🔨", "Watch ⌚", "Pen ✒️"],
                "correct_answer": "Key 🔑",
                "hints": [
                    "💡 It is made of metal and used with a door lock.",
                    "💡 You carry it in your pocket when going out.",
                    "💡 It is the brass door Key 🔑."
                ],
                "explanation": "Superb! The key 🔑 was indeed on the tray.",
                "audio_text": "Which everyday tool was on the tray to unlock doors?"
            }
        ]

    elif game_id == "game_focus":
        # Game 3: Focus & Attention
        return [
            {
                "id": "gfc_q1",
                "game_type": "attention",
                "title": "Focus & Tap the Blue Calm Circles 🔵",
                "subtitle": "Tap ONLY the blue circles. Take your time, there is no rush.",
                "target": "🔵",
                "grid_items": [
                    {"id": "c1", "val": "🔴", "is_target": False},
                    {"id": "c2", "val": "🔵", "is_target": True},
                    {"id": "c3", "val": "🟢", "is_target": False},
                    {"id": "c4", "val": "🔵", "is_target": True},
                    {"id": "c5", "val": "🟡", "is_target": False},
                    {"id": "c6", "val": "🔵", "is_target": True}
                ],
                "target_count": 3,
                "correct_answer": "completed",
                "hints": [
                    "💡 Look for the deep sky blue circular color 🔵.",
                    "💡 Count 1, 2, and 3 blue circles.",
                    "💡 They are nestled between the red and green circles."
                ],
                "explanation": "Fantastic attention to detail! You noticed all the calm blue circles.",
                "audio_text": "Focus and tap each blue circle you see on the screen."
            }
        ]

    elif game_id == "game_routine":
        # Game 4: Daily Routine Puzzle
        return [
            {
                "id": "grp_q1",
                "game_type": "sequencing",
                "title": "What is the natural order for morning wake up?",
                "subtitle": "Tap or arrange these three morning habits from first to last.",
                "puzzle_type": "order_sequence",
                "initial_steps": [
                    {"step_id": "s3", "text": "Have warm healthy breakfast 🥣", "order": 3},
                    {"step_id": "s1", "text": "Gently wake up & stretch 🌅", "order": 1},
                    {"step_id": "s2", "text": "Brush teeth & freshen up 🪥", "order": 2}
                ],
                "correct_sequence": ["s1", "s2", "s3"],
                "hints": [
                    "💡 Think about the very first thing your eyes do when morning arrives.",
                    "💡 After opening your eyes, you freshen your teeth and face.",
                    "💡 Breakfast is enjoyed after freshening up!"
                ],
                "explanation": "Excellent routine awareness! Waking up, freshening up, then breakfast keeps your day peaceful.",
                "audio_text": "What do you normally do first in the morning? Arrange the steps from first to last."
            }
        ]

    elif game_id == "game_match":
        # Game 5: Match & Associate
        return [
            {
                "id": "gma_q1",
                "game_type": "semantic",
                "title": "What do we use this everyday object for?",
                "subtitle": "Match the object to its familiar purpose.",
                "item_emoji": "🪥",
                "item_name": "Toothbrush",
                "question": "A toothbrush is used for...",
                "options": ["Cleaning teeth in the morning", "Combing hair", "Watering potted plants", "Writing letters"],
                "correct_answer": "Cleaning teeth in the morning",
                "hints": [
                    "💡 It works with toothpaste and cool water.",
                    "💡 It keeps your smile healthy and bright.",
                    "💡 It is used for cleaning your teeth!"
                ],
                "explanation": "Spot on! A toothbrush keeps your morning smile fresh and healthy. 🪥",
                "audio_text": "What do we use a toothbrush for?"
            },
            {
                "id": "gma_q2",
                "game_type": "semantic",
                "title": "Match the place to the activity",
                "subtitle": "Where do we normally enjoy this activity?",
                "item_emoji": "🍳",
                "item_name": "Cooking fresh food",
                "question": "In the house, where is warm food prepared?",
                "options": ["Kitchen 🍳", "Bedroom 🛏️", "Balcony 🪴", "Bookshelf 📚"],
                "correct_answer": "Kitchen 🍳",
                "hints": [
                    "💡 Where the stove, pans, and spices live.",
                    "💡 Where delicious aromas of tadka and tea come from.",
                    "💡 The kitchen!"
                ],
                "explanation": "Wonderful! The kitchen is the warm heart of the home.",
                "audio_text": "In the house, where is warm food prepared?"
            }
        ]

    elif game_id == "game_words":
        # Game 6: Words & Language
        return [
            {
                "id": "gw_q1",
                "game_type": "language",
                "title": "Complete the friendly word",
                "subtitle": "What letters finish this familiar word?",
                "prompt_display": "FAMIL__",
                "prompt_hint": "A group of loving people who care for each other",
                "options": ["Y (FAMILY)", "E (FAMILE)", "O (FAMILO)", "T (FAMILT)"],
                "correct_answer": "Y (FAMILY)",
                "hints": [
                    "💡 Priya, Rohan, and Ankit are all part of your...",
                    "💡 It rhymes with 'cheerily' and ends with the letter Y.",
                    "💡 The complete word is FAMILY ❤️."
                ],
                "explanation": "Beautiful! Family is where the heart is. ❤️",
                "audio_text": "Complete the word: F-A-M-I-L blank. Choose the missing letter."
            },
            {
                "id": "gw_q2",
                "game_type": "language",
                "title": "What is the gentle opposite?",
                "subtitle": "Choose the natural opposite of this word.",
                "prompt_display": "DAY ☀️",
                "options": ["NIGHT 🌙", "RAIN 🌧️", "WIND 🍃", "ROAD 🛣️"],
                "correct_answer": "NIGHT 🌙",
                "hints": [
                    "💡 When the sun sets and stars come out.",
                    "💡 Time for sleep and sweet dreams.",
                    "💡 The opposite of Day is Night 🌙."
                ],
                "explanation": "Perfect! Day turns into Night, bringing restful sleep.",
                "audio_text": "What is the gentle opposite of the word DAY?"
            }
        ]

    elif game_id == "game_culture":
        # Game 7: Culture & Familiarity
        return [
            {
                "id": "gc_q1",
                "game_type": "culture",
                "title": "Which joyful festival is celebrated with lights & diyas?",
                "subtitle": "Connect the traditional lamp to its beloved celebration.",
                "image": "https://images.unsplash.com/photo-1512418490979-92798cec1380?w=500&h=350&fit=crop",
                "item_emoji": "🪔",
                "question": "Lighting small earthen clay lamps (Diyas) is the heart of which festival?",
                "options": ["Diwali (Deepavali) 🪔", "Holi (Festival of Colors) 🎨", "Eid 🌙", "New Year 🎆"],
                "correct_answer": "Diwali (Deepavali) 🪔",
                "hints": [
                    "💡 The celebration of lights, sweets, and welcoming prosperity.",
                    "💡 Every home is illuminated with clay diyas and fairy lights.",
                    "💡 It is Diwali 🪔!"
                ],
                "explanation": "Wonderful memories! Diwali brings warmth, light, and delicious sweets to everyone.",
                "audio_text": "Lighting small earthen clay lamps is the heart of which festival?"
            },
            {
                "id": "gc_q2",
                "game_type": "culture",
                "title": "Familiar Flavors of Home",
                "subtitle": "Recognize this beloved soothing beverage.",
                "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&h=350&fit=crop",
                "item_emoji": "☕",
                "question": "What warm, spiced beverage is brewed with ginger and cardamom for morning tea time?",
                "options": ["Masala Chai ☕", "Cold Lemon Soda 🥤", "Iced Water 🧊", "Orange Juice 🍊"],
                "correct_answer": "Masala Chai ☕",
                "hints": [
                    "💡 Brewed with tea leaves, milk, ginger, and elaichi.",
                    "💡 Enjoyed fresh in the morning from a clay kulhad or favorite mug.",
                    "💡 Masala Chai ☕!"
                ],
                "explanation": "Delicious! Nothing comforts the soul like a warm cup of morning Masala Chai.",
                "audio_text": "What warm spiced beverage is brewed with ginger and cardamom for morning tea?"
            }
        ]

    elif game_id == "game_reasoning":
        # Game 8: Sequence & Reasoning
        return [
            {
                "id": "grs_q1",
                "game_type": "reasoning",
                "title": "What number comes next in this calm pattern?",
                "subtitle": "Notice how the numbers count by twos.",
                "prompt_display": "2  →  4  →  6  →  ?",
                "options": ["8", "7", "9", "10"],
                "correct_answer": "8",
                "hints": [
                    "💡 Each step adds 2 more.",
                    "💡 After 6, add two: 7, then...",
                    "💡 The next number is 8!"
                ],
                "explanation": "Brilliant reasoning! 2, 4, 6, and 8 follow a smooth even rhythm.",
                "audio_text": "Look at the pattern: 2, 4, 6, what number comes next?"
            }
        ]

    return []

# ==========================================
# REST API ENDPOINTS
# ==========================================

@app.route('/api/auth/login', methods=['POST'])
@data_locked
def caregiver_login():
    payload = request.get_json(silent=True) or {}
    user = next((u for u in load_data().get("users", []) if u.get("role") == "caregiver" and u.get("email", "").lower() == str(payload.get("email", "")).lower()), None)
    if not user or not payload.get("password") or not bcrypt.checkpw(str(payload["password"]).encode(), user["password_hash"].encode()):
        return jsonify({"error": "Incorrect email or password"}), 401
    return jsonify({"token": create_token(user["id"], "caregiver"), "role": "caregiver"})

@app.route('/api/auth/patient-login', methods=['POST'])
@data_locked
def patient_login():
    patient = load_data()["patient"]
    return jsonify({"token": create_token(patient["id"], "patient"), "role": "patient", "patient": patient})

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "SmritiSaathi Platform API", "time": datetime.now().isoformat()})

@app.route('/api/patient', methods=['GET'])
@require_role('patient', 'caregiver')
def get_patient():
    data = load_data()
    return jsonify({
        "patient": data["patient"],
        "cultural_preferences": data["cultural_preferences"],
        "skill_profile": data["skill_profile"],
        "streak_days": data["patient"]["streak_days"]
    })

@app.route('/api/patient/settings', methods=['POST'])
@require_role('patient', 'caregiver')
def update_patient_settings():
    data = load_data()
    payload = request.json or {}
    settings = data["patient"].setdefault("settings", {})

    # Keep the preference API deliberately narrow: voice preferences are
    # independent from scoring, difficulty, and the recommendation engine.
    if payload.get("interface_language") in INTERFACE_LANGUAGE_IDS:
        settings["interface_language"] = payload["interface_language"]
    if payload.get("voice_language") in VOICE_LANGUAGE_IDS:
        settings["voice_language"] = payload["voice_language"]
    if payload.get("speech_speed") in SPEECH_SPEEDS:
        settings["speech_speed"] = payload["speech_speed"]
    for key in ("voice_enabled", "auto_read_aloud"):
        if isinstance(payload.get(key), bool):
            settings[key] = payload[key]
    save_data(data)
    return jsonify({"success": True, "settings": settings})

@app.route('/api/onboarding/complete', methods=['POST'])
@require_role('patient', 'caregiver')
def complete_onboarding():
    data = load_data()
    payload = request.json or {}
    if "patient_name" in payload:
        data["patient"]["name"] = payload["patient_name"]
        data["patient"]["preferred_name"] = payload["patient_name"]
    if "region" in payload:
        data["patient"]["region"] = payload["region"]
        data["cultural_preferences"]["region"] = payload["region"]
    if "language" in payload:
        data["patient"]["language"] = payload["language"]
    if "voice_language" in payload:
        data["patient"]["settings"]["voice_language"] = payload["voice_language"]
    if "interface_language" in payload:
        data["patient"]["settings"]["interface_language"] = payload["interface_language"]
    if "speech_speed" in payload:
        data["patient"]["settings"]["speech_speed"] = payload["speech_speed"]
    if "auto_read_aloud" in payload:
        data["patient"]["settings"]["auto_read_aloud"] = payload["auto_read_aloud"]
    if "new_family_member" in payload and payload["new_family_member"].get("name"):
        nfm = payload["new_family_member"]
        new_fam = {
            "id": f"fam_{int(time.time())}",
            "name": nfm.get("name", "Loved One"),
            "full_name": nfm.get("full_name", nfm.get("name")),
            "relationship": nfm.get("relationship", "Family"),
            "nickname": nfm.get("nickname", ""),
            "photo": nfm.get("photo", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop"),
            "familiarity_notes": nfm.get("notes", "Added during onboarding"),
            "favorite_activity": "Spending time together",
            "times_recognized": 1,
            "last_recognized": "Today"
        }
        data["family_members"].insert(0, new_fam)

    data["patient"]["onboarding_completed"] = True
    save_data(data)
    return jsonify({"success": True, "patient": data["patient"]})

@app.route('/api/checkin', methods=['GET', 'POST'])
@require_role('patient', 'caregiver')
def daily_checkin():
    data = load_data()
    if request.method == 'GET':
        today_date = datetime.now()
        day_name = today_date.strftime("%A")
        formatted_date = today_date.strftime("%B %d, %Y")
        primary_fam = data["family_members"][0] if data["family_members"] else None
        
        return jsonify({
            "today": {
                "day_name": day_name,
                "formatted_date": formatted_date,
                "greeting": "Good morning" if today_date.hour < 12 else ("Good afternoon" if today_date.hour < 17 else "Good evening"),
                "patient_name": data["patient"]["preferred_name"]
            },
            "orientation_question": {
                "question": f"Today is a peaceful {day_name}. What time of day is it right now?",
                "options": ["Morning 🌅", "Afternoon ☀️", "Evening 🌙"],
                "correct": "Morning 🌅" if today_date.hour < 12 else ("Afternoon ☀️" if today_date.hour < 17 else "Evening 🌙"),
                "hint": "Look outside the window at the gentle light in the sky."
            },
            "family_recognition_test": {
                "member_id": primary_fam["id"],
                "photo": primary_fam["photo"],
                "name": primary_fam["name"],
                "relationship": primary_fam["relationship"],
                "options": [primary_fam["name"], "Sunil", "Ankit", "Manish"],
                "hints": [
                    f"💡 This person is a beloved member of your family.",
                    f"💡 This is your dear {primary_fam['relationship'].lower()}."
                ]
            }
        })
    else:
        data["patient"]["streak_days"] += 1
        save_data(data)
        return jsonify({"success": True, "streak_days": data["patient"]["streak_days"]})

@app.route('/api/games/catalog', methods=['GET'])
@require_role('patient', 'caregiver')
def get_game_catalog():
    return jsonify([
        {
            "id": "game_faces",
            "title": "Familiar Faces",
            "category": "Recognition",
            "icon": "Users",
            "badge": "Heartwarming",
            "color": "peach",
            "bg": "bg-amber-50 border-amber-200 text-amber-800",
            "description": "Recognize beloved children, grandchildren, and dear memories through photos.",
            "duration": "2 mins"
        },
        {
            "id": "game_recall",
            "title": "Remember & Recall",
            "category": "Memory",
            "icon": "Brain",
            "badge": "Memory Practice",
            "color": "lavender",
            "bg": "bg-purple-50 border-purple-200 text-purple-800",
            "description": "View familiar everyday objects, watch them rest, and recall what you noticed.",
            "duration": "3 mins"
        },
        {
            "id": "game_focus",
            "title": "Focus & Attention",
            "category": "Attention",
            "icon": "Target",
            "badge": "Sharpness",
            "color": "sky",
            "bg": "bg-blue-50 border-blue-200 text-blue-800",
            "description": "Spot peaceful colors and shapes with calm, unhurried focus.",
            "duration": "2 mins"
        },
        {
            "id": "game_routine",
            "title": "Daily Routine Puzzle",
            "category": "Routine",
            "icon": "CalendarCheck",
            "badge": "Signature",
            "color": "sage",
            "bg": "bg-emerald-50 border-emerald-200 text-emerald-800",
            "description": "Organize your favorite daily morning or evening habits in comfortable sequence.",
            "duration": "3 mins"
        },
        {
            "id": "game_match",
            "title": "Match & Associate",
            "category": "Association",
            "icon": "Shapes",
            "badge": "Everyday Tools",
            "color": "amber",
            "bg": "bg-orange-50 border-orange-200 text-orange-800",
            "description": "Match common household objects with their purposes and rooms.",
            "duration": "2 mins"
        },
        {
            "id": "game_words",
            "title": "Words & Language",
            "category": "Language",
            "icon": "BookOpen",
            "badge": "Comforting Words",
            "color": "teal",
            "bg": "bg-teal-50 border-teal-200 text-teal-800",
            "description": "Complete familiar positive words and discover gentle opposites.",
            "duration": "2 mins"
        },
        {
            "id": "game_culture",
            "title": "Culture & Familiarity",
            "category": "Culture",
            "icon": "Sparkles",
            "badge": "Beloved Traditions",
            "color": "rose",
            "bg": "bg-rose-50 border-rose-200 text-rose-800",
            "description": "Celebrate fond memories of traditional festivals, music, and home flavors.",
            "duration": "3 mins"
        },
        {
            "id": "game_reasoning",
            "title": "Sequence & Reasoning",
            "category": "Reasoning",
            "icon": "GitBranch",
            "badge": "Gentle Logic",
            "color": "indigo",
            "bg": "bg-indigo-50 border-indigo-200 text-indigo-800",
            "description": "Follow smooth counting patterns and everyday logical sequences.",
            "duration": "2 mins"
        }
    ])

@app.route('/api/games/today-session', methods=['GET'])
@require_role('patient', 'caregiver')
def get_today_session():
    with DATA_LOCK:
        data = load_data()
        session = get_or_create_daily_session(data)
        save_data(data)
        return jsonify({**session, "patient_name": data["patient"]["preferred_name"],
                        "activities_count": len(session["activities"]),
                        "completed_today": session["completed"],
                        "streak_days": data["patient"].get("streak_days", 5)})

@app.route('/api/games/<game_id>', methods=['GET'])
@require_role('patient', 'caregiver')
def get_game(game_id):
    if game_id not in GAME_IDS:
        return jsonify({"error": "Unknown game"}), 404
    data = load_data()
    catalog = {g["id"]: g for g in json.loads(get_game_catalog().data)}[game_id]
    return jsonify({**catalog, "game_id": game_id,
                    "questions": generate_questions_for_game(game_id, data)})

@app.route('/api/games/today-session/progress', methods=['POST'])
@require_role('patient', 'caregiver')
def update_daily_session_progress():
    payload = request.json or {}
    with DATA_LOCK:
        data = load_data()
        session = get_or_create_daily_session(data)
        if payload.get("session_id") != session["session_id"]:
            return jsonify({"error": "Session does not match today's session"}), 409
        game_id = payload.get("game_id")
        for index, activity in enumerate(session["activities"]):
            if activity["game_id"] == game_id:
                if not activity.get("completed") and index != session.get("current_activity_index", 0):
                    return jsonify({"error": "Complete the current scheduled game first"}), 409
                activity["completed"] = True
                session["current_activity_index"] = min(index + 1, len(session["activities"]) - 1)
                break
        else:
            return jsonify({"error": "Game is not scheduled in this session"}), 400
        save_data(data)
        return jsonify({"success": True, "session": session})

@app.route('/api/sessions/record-attempt', methods=['POST'])
@require_role('patient', 'caregiver')
@data_locked
def record_attempt():
    data = load_data()
    payload = request.json or {}

    game_type = payload.get("game_type", "recognition")
    is_correct = payload.get("is_correct", False)
    hints_used = payload.get("hints_used", 0)
    response_time_ms = payload.get("response_time_ms", 2500)
    question_id = payload.get("question_id", "unknown")

    attempt_entry = {
        "question_id": question_id,
        "game_type": game_type,
        "is_correct": is_correct,
        "hints_used": hints_used,
        "response_time_ms": response_time_ms,
        "timestamp": datetime.now().isoformat()
    }
    data["question_attempts_log"].append(attempt_entry)

    if game_type in data["skill_profile"]:
        skill = data["skill_profile"][game_type]
        old_acc = skill.get("accuracy_pct", 80)
        weight = 0.15
        target_score = 100 if (is_correct and hints_used == 0) else (85 if is_correct else 60)
        new_acc = round(old_acc * (1 - weight) + target_score * weight)
        skill["accuracy_pct"] = new_acc

        if new_acc >= 90 and skill["level"] < 4:
            skill["level"] += 1
            skill["trend"] = "up"
        elif new_acc < 65 and skill["level"] > 1:
            skill["level"] -= 1
            skill["trend"] = "stable"

        old_hints = skill.get("hints_avg", 0.5)
        skill["hints_avg"] = round(old_hints * 0.8 + hints_used * 0.2, 1)

    save_data(data)
    return jsonify({
        "success": True,
        "game_type": game_type,
        "updated_skill": data["skill_profile"].get(game_type)
    })

@app.route('/api/sessions/complete', methods=['POST'])
@require_role('patient', 'caregiver')
def complete_session():
    payload = request.json or {}
    with DATA_LOCK:
        data = load_data()
        session = get_or_create_daily_session(data)
        if payload.get("session_id") != session["session_id"]:
            return jsonify({"error": "Session does not match today's session"}), 409
        if session.get("completed"):
            return jsonify({"success": True, "already_completed": True, "patient": data["patient"]})
        if not all(activity.get("completed") for activity in session["activities"]):
            return jsonify({"error": "Complete each scheduled game before finishing"}), 409

        activities_completed = len(session["activities"])
        duration_min = payload.get("duration_minutes", 8)
        stars = payload.get("stars", 5)
        session["completed"] = True
        session["completed_at"] = datetime.now().isoformat()
        data["patient"]["current_session_done_today"] = True
        data["patient"]["total_sessions_completed"] += 1
        data["patient"]["last_session_date"] = local_day()

        new_session_record = {
            "session_id": session["session_id"],
            "date": local_day(),
            "completed_activities": activities_completed,
            "duration_minutes": duration_min,
            "encouragement": "Wonderful focus and warmth today! You completed all activities with a smile.",
            "stars": stars,
            "skills_practiced": ["Recognition", "Routine", "Memory", "Culture"],
            "accuracy": 90
        }
        data["history_sessions"].insert(0, new_session_record)

        new_alert = {
        "id": f"alt_{int(time.time())}",
        "severity": "success",
        "title": f"Daily Wellness Session Completed 🎉",
        "message": f"Devendra completed {activities_completed} activities in {duration_min} minutes with great cheerfulness.",
        "timestamp": "Just now",
        "action_taken": "Session recorded; next recommended activities scheduled for tomorrow."
    }
        data["alerts"].insert(0, new_alert)
        save_data(data)
    return jsonify({
        "success": True,
        "message": "Session completed successfully! You did wonderful work today. ❤️",
        "patient": data["patient"]
    })

# --- Family Members Management ---
@app.route('/api/family', methods=['GET', 'POST'])
@require_role('patient', 'caregiver')
def handle_family():
    data = load_data()
    if request.method == 'GET':
        return jsonify(data.get("family_members", []))
    else:
        if request.auth['role'] != 'caregiver': return jsonify({"error": "You do not have permission for this action"}), 403
        payload = request.json or {}
        new_id = f"fam_{int(time.time())}"
        new_member = {
            "id": new_id,
            "name": payload.get("name", "Family Member"),
            "full_name": payload.get("full_name", payload.get("name")),
            "relationship": payload.get("relationship", "Relative"),
            "nickname": payload.get("nickname", ""),
            "photo": payload.get("photo", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop"),
            "familiarity_notes": payload.get("familiarity_notes", "Cherished family member"),
            "favorite_activity": payload.get("favorite_activity", "Talking together"),
            "times_recognized": 0,
            "last_recognized": "Recently added"
        }
        data["family_members"].append(new_member)
        save_data(data)
        return jsonify({"success": True, "member": new_member})

@app.route('/api/family/<member_id>', methods=['PUT', 'DELETE'])
@require_role('caregiver')
def modify_family(member_id):
    data = load_data()
    if request.method == 'DELETE':
        data["family_members"] = [m for m in data["family_members"] if m["id"] != member_id]
        save_data(data)
        return jsonify({"success": True, "deleted_id": member_id})
    else:
        payload = request.json or {}
        for m in data["family_members"]:
            if m["id"] == member_id:
                m.update(payload)
                save_data(data)
                return jsonify({"success": True, "member": m})
        return jsonify({"error": "Member not found"}), 404

# --- Routines Management ---
@app.route('/api/routines', methods=['GET', 'POST'])
@require_role('patient', 'caregiver')
def handle_routines():
    data = load_data()
    if request.method == 'GET':
        return jsonify(data.get("routines", []))
    else:
        if request.auth['role'] != 'caregiver': return jsonify({"error": "You do not have permission for this action"}), 403
        payload = request.json or {}
        save_data(data)
        return jsonify({"success": True})

@app.route('/api/routines/<routine_id>/step/<step_id>/toggle', methods=['POST'])
def toggle_routine_step(routine_id, step_id):
    data = load_data()
    for rt in data.get("routines", []):
        if rt["id"] == routine_id:
            for s in rt["steps"]:
                if s["id"] == step_id:
                    s["completed"] = not s.get("completed", False)
                    save_data(data)
                    return jsonify({"success": True, "step": s})
    return jsonify({"error": "Step not found"}), 404

# --- Reminders Management ---
@app.route('/api/reminders', methods=['GET', 'POST'])
@require_role('patient', 'caregiver')
def handle_reminders():
    data = load_data()
    if request.method == 'GET':
        return jsonify(data.get("reminders", []))
    else:
        if request.auth['role'] != 'caregiver': return jsonify({"error": "You do not have permission for this action"}), 403
        payload = request.json or {}
        new_rem = {
            "id": f"rem_{int(time.time())}",
            "type": payload.get("type", "routine"),
            "title": payload.get("title", "New Reminder"),
            "description": payload.get("description", ""),
            "time": payload.get("time", "12:00 PM"),
            "icon": payload.get("icon", "Bell"),
            "badge": payload.get("badge", "Reminder"),
            "completed": False,
            "due_period": payload.get("due_period", "Daily")
        }
        data["reminders"].append(new_rem)
        save_data(data)
        return jsonify({"success": True, "reminder": new_rem})

@app.route('/api/reminders/<rem_id>/toggle', methods=['POST'])
@require_role('patient', 'caregiver')
def toggle_reminder(rem_id):
    data = load_data()
    for rem in data.get("reminders", []):
        if rem["id"] == rem_id:
            rem["completed"] = not rem.get("completed", False)
            save_data(data)
            return jsonify({"success": True, "reminder": rem})
    return jsonify({"error": "Reminder not found"}), 404

@app.route('/api/reminders/<rem_id>', methods=['DELETE'])
@require_role('caregiver')
def delete_reminder(rem_id):
    data = load_data()
    data["reminders"] = [r for r in data["reminders"] if r["id"] != rem_id]
    save_data(data)
    return jsonify({"success": True, "deleted_id": rem_id})

# --- Cultural Preferences ---
@app.route('/api/culture', methods=['GET', 'POST'])
@require_role('caregiver')
def handle_culture():
    data = load_data()
    if request.method == 'GET':
        return jsonify(data.get("cultural_preferences", {}))
    else:
        payload = request.json or {}
        data["cultural_preferences"].update(payload)
        save_data(data)
        return jsonify({"success": True, "cultural_preferences": data["cultural_preferences"]})

# --- Caregiver Analytics & Overview ---
@app.route('/api/caregiver/overview', methods=['GET'])
@require_role('caregiver')
def caregiver_overview():
    data = load_data()
    return jsonify({
        "caregiver": data["caregiver"],
        "patient": data["patient"],
        "total_sessions": data["patient"]["total_sessions_completed"],
        "streak_days": data["patient"]["streak_days"],
        "recent_alerts": data["alerts"][:5],
        "skill_profile": data["skill_profile"],
        "upcoming_reminders": [r for r in data["reminders"] if not r.get("completed")]
    })

@app.route('/api/caregiver/analytics', methods=['GET'])
@require_role('caregiver')
def caregiver_analytics():
    data = load_data()
    today = local_day()
    event_types = [
        "WHERE_AM_I_USED", "ROUTE_REQUESTED", "ROUTE_COMPLETED",
        "OBJECT_RECOGNITION_USED", "OBJECT_RECOGNITION_SUCCESS",
        "OBJECT_RECOGNITION_UNCERTAIN", "CAREGIVER_ASSISTANCE_REQUESTED"
    ]
    today_events = [event for event in data.get("assistance_events", []) if str(event.get("timestamp", ""))[:10] == today]
    counts = {event_type: sum(event.get("event_type") == event_type for event in today_events) for event_type in event_types}
    location_names = {item["id"]: item.get("familiar_name") or item.get("name") for item in data.get("home_locations", [])}
    object_names = {item["id"]: item.get("familiar_name") or item.get("name") for item in data.get("familiar_objects", [])}
    def requested(events, field, names):
        totals = {}
        for event in events:
            item_id = event.get(field)
            if item_id and item_id in names:
                totals[item_id] = totals.get(item_id, 0) + 1
        return [{"id": item_id, "name": names[item_id], "count": count} for item_id, count in sorted(totals.items(), key=lambda item: (-item[1], item[0]))[:5]]
    house_assistance = {
        "today": counts,
        "most_requested": {
            "locations": requested(today_events, "location_id", location_names),
            "objects": requested(today_events, "object_id", object_names)
        }
    }
    dates = [(datetime.now() - timedelta(days=13-i)).strftime("%b %d") for i in range(14)]
    recognition_scores = [86, 88, 87, 89, 90, 88, 91, 93, 90, 92, 94, 91, 93, 95]
    memory_scores = [62, 65, 64, 66, 68, 65, 67, 70, 68, 69, 71, 68, 70, 72]
    attention_scores = [78, 80, 82, 81, 84, 83, 85, 87, 85, 86, 88, 86, 88, 89]
    response_times_sec = [5.4, 5.1, 4.9, 4.8, 4.5, 4.7, 4.3, 4.1, 4.0, 3.8, 3.9, 3.7, 3.6, 3.5]
    hint_usage_pct = [32, 29, 28, 26, 25, 27, 22, 20, 21, 18, 17, 19, 16, 14]

    return jsonify({
        "dates": dates,
        "skills_trend": {
            "recognition": recognition_scores,
            "memory": memory_scores,
            "attention": attention_scores
        },
        "response_times_sec": response_times_sec,
        "hint_usage_pct": hint_usage_pct,
        "skill_breakdown": data["skill_profile"],
        "recent_sessions": data.get("history_sessions", []),
        "domain_accuracies": {
            "Familiar Recognition": 92,
            "Cultural Heritage": 95,
            "Daily Routine": 88,
            "Visual Attention": 85,
            "Semantic Match": 82,
            "Words & Language": 79,
            "Logical Sequencing": 71,
            "Working Memory": 68
        },
        "house_assistance": house_assistance
    })

# --- House & Object Assistance ---
def assistance_item(data, collection, item_id):
    return next((item for item in data.get(collection, []) if item.get("id") == item_id), None)

@app.route('/api/home/locations', methods=['GET', 'POST'])
@require_role('patient', 'caregiver')
@data_locked
def home_locations():
    data = load_data()
    if request.method == 'GET': return jsonify(data.get('home_locations', []))
    if request.auth['role'] != 'caregiver': return jsonify({'error': 'You do not have permission for this action'}), 403
    payload = request.get_json(silent=True) or {}
    now = datetime.now().isoformat()
    location = {"id": f"loc_{int(time.time() * 1000)}", "patient_id": data['patient']['id'], "name": payload.get('name', 'Room'), "familiar_name": payload.get('familiar_name', payload.get('name', 'Room')), "type": payload.get('type', 'other'), "photo": payload.get('photo'), "description": payload.get('description', ''), "voice_description": payload.get('voice_description', ''), "is_active": payload.get('is_active', True), "created_at": now, "updated_at": now}
    data['home_locations'].append(location); save_data(data)
    return jsonify({'success': True, 'location': location})

@app.route('/api/home/locations/<location_id>', methods=['PUT', 'DELETE'])
@require_role('caregiver')
@data_locked
def home_location_detail(location_id):
    data = load_data(); location = assistance_item(data, 'home_locations', location_id)
    if not location: return jsonify({'error': 'Location not found'}), 404
    if request.method == 'DELETE':
        data['home_locations'] = [x for x in data['home_locations'] if x['id'] != location_id]
        data['home_connections'] = [x for x in data['home_connections'] if location_id not in (x['from_location_id'], x['to_location_id'])]
        save_data(data); return jsonify({'success': True, 'deleted_id': location_id})
    location.update(request.get_json(silent=True) or {}); location['updated_at'] = datetime.now().isoformat(); save_data(data)
    return jsonify({'success': True, 'location': location})

@app.route('/api/home/connections', methods=['GET', 'POST'])
@require_role('patient', 'caregiver')
@data_locked
def home_connections():
    data = load_data()
    if request.method == 'GET': return jsonify(data.get('home_connections', []))
    if request.auth['role'] != 'caregiver': return jsonify({'error': 'You do not have permission for this action'}), 403
    p = request.get_json(silent=True) or {}
    if not assistance_item(data, 'home_locations', p.get('from_location_id')) or not assistance_item(data, 'home_locations', p.get('to_location_id')): return jsonify({'error': 'Both locations must exist'}), 400
    connection = {"id": f"conn_{int(time.time() * 1000)}", "patient_id": data['patient']['id'], "from_location_id": p['from_location_id'], "to_location_id": p['to_location_id'], "instruction": p.get('instruction', ''), "voice_instruction": p.get('voice_instruction', ''), "distance_estimate": p.get('distance_estimate'), "created_at": datetime.now().isoformat()}
    data['home_connections'].append(connection); save_data(data); return jsonify({'success': True, 'connection': connection})

@app.route('/api/home/connections/<connection_id>', methods=['PUT', 'DELETE'])
@require_role('caregiver')
@data_locked
def home_connection_detail(connection_id):
    data = load_data(); connection = assistance_item(data, 'home_connections', connection_id)
    if not connection: return jsonify({'error': 'Connection not found'}), 404
    if request.method == 'DELETE': data['home_connections'] = [x for x in data['home_connections'] if x['id'] != connection_id]; save_data(data); return jsonify({'success': True, 'deleted_id': connection_id})
    connection.update(request.get_json(silent=True) or {}); save_data(data); return jsonify({'success': True, 'connection': connection})

@app.route('/api/home/route', methods=['GET'])
@require_role('patient', 'caregiver')
@data_locked
def home_route():
    data = load_data(); start, target = request.args.get('from'), request.args.get('to')
    locations = {x['id']: x for x in data.get('home_locations', [])}
    if start not in locations or target not in locations: return jsonify({'found': False, 'message': "I don't have a route to this place yet."})
    queue, previous = deque([start]), {start: None}
    edges = data.get('home_connections', [])
    while queue:
        current = queue.popleft()
        if current == target: break
        for edge in edges:
            neighbor = edge['to_location_id'] if edge['from_location_id'] == current else (edge['from_location_id'] if edge['to_location_id'] == current else None)
            if neighbor and neighbor not in previous: previous[neighbor] = (current, edge); queue.append(neighbor)
    if target not in previous: return jsonify({'found': False, 'message': "I don't have a route to this place yet."})
    path = []
    while target is not None:
        parent = previous[target]; path.append({**locations[target], 'instruction': parent[1].get('instruction', '') if parent else ''}); target = parent[0] if parent else None
    return jsonify({'found': True, 'route': list(reversed(path))})

@app.route('/api/objects', methods=['GET', 'POST'])
@require_role('patient', 'caregiver')
@data_locked
def familiar_objects():
    data = load_data()
    if request.method == 'GET': return jsonify(data.get('familiar_objects', []))
    if request.auth['role'] != 'caregiver': return jsonify({'error': 'You do not have permission for this action'}), 403
    p = request.get_json(silent=True) or {}; item = {"id": f"obj_{int(time.time() * 1000)}", "patient_id": data['patient']['id'], "name": p.get('name', 'Familiar object'), "familiar_name": p.get('familiar_name', p.get('name', 'Familiar object')), "image": p.get('image'), "everyday_use": p.get('everyday_use', ''), "room_id": p.get('room_id'), "person_id": p.get('person_id'), "routine_id": p.get('routine_id'), "voice_explanation": p.get('voice_explanation', ''), "created_at": datetime.now().isoformat()}
    data['familiar_objects'].append(item); save_data(data); return jsonify({'success': True, 'object': item})

@app.route('/api/objects/<object_id>', methods=['PUT', 'DELETE'])
@require_role('caregiver')
@data_locked
def familiar_object_detail(object_id):
    data = load_data(); item = assistance_item(data, 'familiar_objects', object_id)
    if not item: return jsonify({'error': 'Object not found'}), 404
    if request.method == 'DELETE': data['familiar_objects'] = [x for x in data['familiar_objects'] if x['id'] != object_id]; save_data(data); return jsonify({'success': True, 'deleted_id': object_id})
    item.update(request.get_json(silent=True) or {}); save_data(data); return jsonify({'success': True, 'object': item})

@app.route('/api/object-recognition', methods=['POST'])
@require_role('patient', 'caregiver')
@data_locked
def object_recognition():
    data = load_data(); payload = request.get_json(silent=True) or request.form.to_dict()
    result = ObjectRecognitionService().recognize(payload.get('image') or request.files.get('image'), payload.get('expected_object_id'), data.get('familiar_objects', []))
    return jsonify(result)

@app.route('/api/assistance/events', methods=['GET', 'POST'])
@require_role('patient', 'caregiver')
@data_locked
def assistance_events():
    data = load_data()
    if request.method == 'GET':
        if request.auth['role'] != 'caregiver': return jsonify({'error': 'You do not have permission for this action'}), 403
        return jsonify(data.get('assistance_events', []))
    p = request.get_json(silent=True) or {}; event = {"id": p.get('id', f"evt_{int(time.time() * 1000)}"), "patient_id": data['patient']['id'], "event_type": p.get('event_type', 'ASSISTANCE_USED'), "timestamp": p.get('timestamp', datetime.now().isoformat()), "location_id": p.get('location_id'), "object_id": p.get('object_id'), "success": p.get('success', True), "recognition_result": p.get('recognition_result'), "offline": p.get('offline', False), "sync_status": "synced"}
    if not assistance_item(data, 'assistance_events', event['id']): data['assistance_events'].append(event); save_data(data)
    return jsonify({'success': True, 'event': event})

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

if __name__ == '__main__':
    os.makedirs(os.path.join(os.path.dirname(__file__), 'static'), exist_ok=True)
    load_data()
    print("SmritiSaathi Server starting on http://localhost:5000")
    print(f"Dev caregiver login: ananya.sharma@example.com / {DEV_CAREGIVER_PASSWORD}")
    app.run(host='0.0.0.0', port=5000, debug=False)
