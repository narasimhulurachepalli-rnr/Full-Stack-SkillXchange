import os
import sys
import django
from datetime import datetime

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillxchange.settings')
django.setup()
import mongoengine
from apps.authentication.models import UserProfile
from apps.skills.models import Category, Skill
from apps.exchanges.models import ExchangeRequest
from apps.sessions.models import Session, Review
from apps.chat.models import ChatMessage
from apps.wallet.models import Wallet, Transaction

def seed():
    print(">>> Seeding MongoDB Atlas cluster with comprehensive SkillXchange data...")

    db = mongoengine.connection.get_db()
    try:
        db.skills.delete_many({"name": None})
        db.categories.delete_many({"name": None})
        db.user_profiles.delete_many({"email": None})
    except Exception as clean_err:
        print(f">>> Pre-seed clean warning: {clean_err}")

    # 1. Categories
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

    # 2. Skills
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

    # 3. Users
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
            "credits": 5,
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
            "credits": 3,
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
            "credits": 3,
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
            "credits": 2,
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
            "credits": 2,
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
            set__credits=u_data["credits"],
            set__avatar=u_data["avatar"],
            set__role=u_data["role"],
            set__is_verified=u_data["is_verified"],
            upsert=True
        )

        # Create/Update Wallet for each user
        w = Wallet.objects(user_email=u_data["email"]).first()
        if not w:
            w = Wallet(user_email=u_data["email"], balance=float(u_data["credits"]))
            w.save()
            Transaction(
                wallet_id=str(w.id),
                sender_email="system@skillxchange.com",
                receiver_email=u_data["email"],
                amount=1.0,
                type="Welcome Bonus",
                reason="Initial SkillXchange Welcome Bonus",
                status="Success",
                balance_after=float(u_data["credits"])
            ).save()

    print(f"[OK] Seeded {len(users)} user profiles and wallets into MongoDB Atlas.")

    # 4. Exchange Requests
    exchanges = [
        # Incoming request for rachepallinandini@gmail.com
        {
            "sender_email": "charan@mits.ac.in",
            "receiver_email": "rachepallinandini@gmail.com",
            "learn_skill": "Python",
            "teach_skill": "React JS",
            "message": "Hi Nandini! I'd love to learn Python from you in exchange for React JS mentoring.",
            "status": "Pending"
        },
        # Incoming request for rachepallinandini@gmail.com
        {
            "sender_email": "sowmya@mits.ac.in",
            "receiver_email": "rachepallinandini@gmail.com",
            "learn_skill": "Data Structures",
            "teach_skill": "SQL",
            "message": "Hey Nandini, can we swap Data Structures for SQL query optimization?",
            "status": "Pending"
        },
        # Sent request from rachepallinandini@gmail.com
        {
            "sender_email": "rachepallinandini@gmail.com",
            "receiver_email": "ravi.t@mits.ac.in",
            "learn_skill": "C++",
            "teach_skill": "Python",
            "message": "Hi Ravi, I saw your C++ skills. Want to do a exchange for Python?",
            "status": "Pending"
        },
        # Accepted exchange
        {
            "sender_email": "rachepallinandini@gmail.com",
            "receiver_email": "charan@mits.ac.in",
            "learn_skill": "React JS",
            "teach_skill": "Python",
            "message": "Hi Charan, let's schedule a session for React JS basics!",
            "status": "Accepted"
        },
        # Incoming for nandini@email.com
        {
            "sender_email": "ravi.t@mits.ac.in",
            "receiver_email": "nandini@email.com",
            "learn_skill": "Python",
            "teach_skill": "C++",
            "message": "Hey Nandini! Let's swap C++ and Python.",
            "status": "Pending"
        }
    ]

    for ex in exchanges:
        ExchangeRequest.objects(
            sender_email=ex["sender_email"],
            receiver_email=ex["receiver_email"],
            learn_skill=ex["learn_skill"]
        ).update_one(
            set__teach_skill=ex["teach_skill"],
            set__message=ex["message"],
            set__status=ex["status"],
            upsert=True
        )
    print(f"[OK] Seeded {len(exchanges)} exchange requests into MongoDB Atlas.")

    # 5. Sessions
    sessions = [
        {
            "exchange_id": "seed-ex-1",
            "skill_name": "React JS Basics & Component State",
            "teacher_email": "charan@mits.ac.in",
            "learner_email": "rachepallinandini@gmail.com",
            "scheduled_time": datetime.utcnow(),
            "meeting_link": "https://meet.google.com/abc-defg-hij",
            "notes": "Bring Node.js installed on your setup.",
            "mode": "Online",
            "status": "Scheduled"
        },
        {
            "exchange_id": "seed-ex-2",
            "skill_name": "Python Data Structures & Dictionaries",
            "teacher_email": "rachepallinandini@gmail.com",
            "learner_email": "charan@mits.ac.in",
            "scheduled_time": datetime.utcnow(),
            "meeting_link": "https://meet.google.com/xyz-uvwx-rst",
            "notes": "Covering lists, sets, and big-O efficiency.",
            "mode": "Online",
            "status": "Scheduled"
        },
        {
            "exchange_id": "seed-ex-3",
            "skill_name": "React JS Basics",
            "teacher_email": "charan@mits.ac.in",
            "learner_email": "nandini@email.com",
            "scheduled_time": datetime.utcnow(),
            "meeting_link": "https://meet.google.com/abc-defg-hij",
            "notes": "Intro to JSX and props.",
            "mode": "Online",
            "status": "Scheduled"
        }
    ]

    for s in sessions:
        Session.objects(
            teacher_email=s["teacher_email"],
            learner_email=s["learner_email"],
            skill_name=s["skill_name"]
        ).update_one(
            set__exchange_id=s["exchange_id"],
            set__scheduled_time=s["scheduled_time"],
            set__meeting_link=s["meeting_link"],
            set__notes=s["notes"],
            set__mode=s["mode"],
            set__status=s["status"],
            upsert=True
        )
    print(f"[OK] Seeded {len(sessions)} learning sessions into MongoDB Atlas.")

    # 6. Reviews
    reviews = [
        {
            "session_id": "seed-sess-1",
            "reviewer_email": "charan@mits.ac.in",
            "reviewee_email": "rachepallinandini@gmail.com",
            "rating": 5,
            "comment": "Outstanding teaching! Explained Python concepts with great real-world examples."
        },
        {
            "session_id": "seed-sess-2",
            "reviewer_email": "sowmya@mits.ac.in",
            "reviewee_email": "rachepallinandini@gmail.com",
            "rating": 5,
            "comment": "Super patient mentor! Helped me master binary search trees quickly."
        },
        {
            "session_id": "seed-sess-3",
            "reviewer_email": "charan@mits.ac.in",
            "reviewee_email": "nandini@email.com",
            "rating": 5,
            "comment": "Great session! Very attentive and knowledgeable."
        }
    ]

    for r in reviews:
        Review.objects(
            reviewer_email=r["reviewer_email"],
            reviewee_email=r["reviewee_email"]
        ).update_one(
            set__session_id=r["session_id"],
            set__rating=r["rating"],
            set__comment=r["comment"],
            upsert=True
        )
    print(f"[OK] Seeded {len(reviews)} reviews into MongoDB Atlas.")

    # 7. Chat Messages
    messages = [
        {
            "sender_email": "charan@mits.ac.in",
            "receiver_email": "rachepallinandini@gmail.com",
            "message": "Hi Nandini! Ready for our React JS and Python exchange session?"
        },
        {
            "sender_email": "rachepallinandini@gmail.com",
            "receiver_email": "charan@mits.ac.in",
            "message": "Yes Charan! I've set up the notes for Python data structures."
        },
        {
            "sender_email": "charan@mits.ac.in",
            "receiver_email": "rachepallinandini@gmail.com",
            "message": "Awesome! Here is the meeting link: https://meet.google.com/abc-defg-hij"
        },
        {
            "sender_email": "charan@mits.ac.in",
            "receiver_email": "nandini@email.com",
            "message": "Hi Nandini! Let me know when you want to start the React session."
        }
    ]

    for m in messages:
        ChatMessage(
            sender_email=m["sender_email"],
            receiver_email=m["receiver_email"],
            message=m["message"],
            is_read=True
        ).save()
    print(f"[OK] Seeded {len(messages)} chat messages into MongoDB Atlas.")

    print(">>> Seeding completed successfully!")

if __name__ == '__main__':
    seed()
