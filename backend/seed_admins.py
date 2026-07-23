# SEED SCRIPT: Run once to create the two original admin accounts. Requires user IDs from Supabase Auth.
from database import SessionLocal
import models

ORIGINAL_ADMINS = [
    {
        "user_id": "8a23ca5b-57e7-4d47-a819-1b85599ea73c",
        "role": "original_admin",
        "created_by": "dev"
    },
    {
        "user_id": "2d9b0e42-6fb8-4531-90b2-5c62d9dd8554",
        "role": "original_admin",
        "created_by": "dev"
    }
]

def seed():
    db = SessionLocal()
    try:
        for admin in ORIGINAL_ADMINS:
            # Check if already exists - safe to re-run
            existing = db.query(models.UserRole).filter(
                models.UserRole.user_id == admin["user_id"]
            ).first()
            if existing:
                print(f"Already exists: skipping {admin["user_id"]}")
                continue

            new_admin = models.UserRole(**admin)
            db.add(new_admin)
            print(f"Created original_admin: {admin['user_id']}")

        db.commit()
        print("Seeding complete")
    finally:
        db.close()


if __name__ == "__main__":
    seed()