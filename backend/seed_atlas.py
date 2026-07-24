import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillxchange.settings')
django.setup()
import mongoengine
from apps.authentication.models import UserProfile
from apps.skills.models import Category, Skill

def seed():
    print(">>> Seeding MongoDB Atlas cluster with initial SkillXchange data...")

    db = mongoengine.connection.get_db()
    try:
        db.skills.delete_many({"name": None})
        db.categories.delete_many({"name": None})
        db.user_profiles.delete_many({"email": None})
    except Exception as clean_err:
        print(f">>> Pre-seed clean warning: {clean_err}")

    # Categories
    categories = [
        {"name": "Programming", "description": "Coding, software engineering, and systems development."},
        {"name": "Graphic Design", "description": "UI/UX layout, vectors, illustrations, and styling."},
        {"name": "Music", "description": "Vocal tuning, guitars, and beat-mixing tools."},
        {"name": "Languages", "description": "Speaking, grammar coaching, and accents."},
        {"name": "Fitness & Well-being", "description": "Yoga, gym workout regimens, and mindfulness."},
        {"name": "Cooking", "description": "Culinary arts, pastries, and food preparation."},
        {"name": "Career Prep", "description": "Resumes, interviews, and public speaking."},
        {"name": "Gardening & DIY", "description": "Horticulture, carpentry, and crafts."}
    ]

    for cat_data in categories:
        Category.objects(name=cat_data["name"]).update_one(set__description=cat_data["description"], upsert=True)
    print(f"[OK] Seeded {len(categories)} categories into MongoDB Atlas.")

    # Skills
    skills = [
        {"name": "React JS", "category_name": "Programming", "description": "Frontend web app state, components, and hooks."},
        {"name": "Python", "category_name": "Programming", "description": "Syntax, lists, dictionaries, script files, and libraries."},
        {"name": "UI/UX Design", "category_name": "Graphic Design", "description": "Figma wireframing, color systems, and user behavior specs."},
        {"name": "French", "category_name": "Languages", "description": "Conversational vocabulary, pronunciation, and spelling rules."},
        {"name": "Data Structures", "category_name": "Programming", "description": "Linked lists, binary trees, sorting algorithms, and big-O notation."},
        {"name": "Video Editing", "category_name": "Graphic Design", "description": "Adobe Premiere transitions, audio level mixing, and color grading."},
        {"name": "Yoga", "category_name": "Fitness & Well-being", "description": "Hatha posture sequences, breathing cycles, and meditation postures."}
    ]

    for sk_data in skills:
        Skill.objects(name=sk_data["name"]).update_one(
            set__category_name=sk_data["category_name"],
            set__description=sk_data["description"],
            upsert=True
        )
    print(f"[OK] Seeded {len(skills)} skills into MongoDB Atlas.")

    # Users
    users = [
        {
            "email": "rachepallinandini@gmail.com",
            "full_name": "Nandini Rachepalli",
            "bio": "Platform Owner & Administrator of SkillXchange community.",
            "phone": "+91 9876543210",
            "major": "CSE - MITS Madanapalle (Platform Owner)",
            "teach_skills": ["Python", "React JS", "Data Structures", "Full Stack Web"],
            "learn_skills": ["UI/UX Design", "Machine Learning", "System Design"],
            "rating_avg": 5.0,
            "points": 1500,
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            "role": "Admin",
            "is_verified": True
        },
        {
            "email": "nandini@email.com",
            "full_name": "Nandini R",
            "bio": "Passionate learner and enthusiast about teaching and learning new skills.",
            "phone": "+91 9876543210",
            "major": "CSE - 3rd Year, MITS Madanapalle",
            "teach_skills": ["Python", "C Programming", "Data Structures", "HTML", "CSS"],
            "learn_skills": ["React JS", "Django", "UI/UX Design", "Machine Learning"],
            "rating_avg": 4.6,
            "points": 320,
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            "role": "Admin",
            "is_verified": True
        },
        {
            "email": "charan@mits.ac.in",
            "full_name": "Charan K",
            "bio": "Computer Science major. Love teaching Java and web development basics.",
            "phone": "+91 9876500001",
            "major": "CSE - 3rd Year",
            "teach_skills": ["React JS", "JavaScript", "Java"],
            "learn_skills": ["UI/UX Design", "Figma"],
            "rating_avg": 4.8,
            "points": 1250,
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            "role": "User",
            "is_verified": True
        },
        {
            "email": "sowmya@mits.ac.in",
            "full_name": "Sowmya P",
            "bio": "Data Analyst enthusiast. Python tutor, sql queries optimization champion.",
            "phone": "+91 9876500002",
            "major": "IT - 3rd Year",
            "teach_skills": ["Python", "Django", "SQL"],
            "learn_skills": ["Yoga", "French"],
            "rating_avg": 4.7,
            "points": 980,
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            "role": "User",
            "is_verified": True
        },
        {
            "email": "ravi.t@mits.ac.in",
            "full_name": "Ravi Teja",
            "bio": "Competitive programmer. C++ wizard.",
            "phone": "+91 9876500003",
            "major": "ECE - 2nd Year",
            "teach_skills": ["C++", "Java", "Data Structures"],
            "learn_skills": ["Video Editing", "Photoshop"],
            "rating_avg": 4.6,
            "points": 860,
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
            "role": "User",
            "is_verified": True
        }
    ]

    for u_data in users:
        UserProfile.objects(email=u_data["email"]).update_one(
            set__full_name=u_data["full_name"],
            set__bio=u_data["bio"],
            set__phone=u_data["phone"],
            set__major=u_data["major"],
            set__teach_skills=u_data["teach_skills"],
            set__learn_skills=u_data["learn_skills"],
            set__rating_avg=u_data["rating_avg"],
            set__points=u_data["points"],
            set__avatar=u_data["avatar"],
            set__role=u_data["role"],
            set__is_verified=u_data["is_verified"],
            upsert=True
        )
    print(f"[OK] Seeded {len(users)} user profiles into MongoDB Atlas.")
    print(">>> Seeding completed successfully!")

if __name__ == '__main__':
    seed()
