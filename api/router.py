from fastapi import APIRouter

from api.auth import router as auth_router
from api.users import router as users_router
from api.tickets import router as tickets_router
from api.comments import router as comments_router

router = APIRouter()

router.include_router(auth_router,prefix="/api")
router.include_router(users_router, prefix="/api/User")
router.include_router(tickets_router, prefix="/api/Ticket")
router.include_router(comments_router,prefix="/api/Comment")

