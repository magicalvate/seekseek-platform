MOCK_SEARCH_RESPONSE = {
    "question": "Which meetings did Alice attend?",
    "answer": {
        "meetings": [
            {
                "meeting_title": "Q2 Sprint Planning",
                "meeting_time": "2026-05-11 16:01:11",
                "participants": ["Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Henry", "Iris", "Jack"],
                "subject_category": "SPRINT_PLANNING"
            },
            {
                "meeting_title": "AI Integration Review",
                "meeting_time": "2026-05-12 13:59:42",
                "participants": ["Alice", "Bob", "Carol", "David", "Eve", "Frank"],
                "subject_category": "TECH_REVIEW"
            },
            {
                "meeting_title": "Project Retrospective",
                "meeting_time": "2026-05-10 20:00:18",
                "participants": ["Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Henry", "Iris", "Jack"],
                "subject_category": "RETROSPECTIVE"
            },
            {
                "meeting_title": "Overseas Rollout Assessment",
                "meeting_time": "2026-05-19 10:03:15",
                "participants": ["Alice", "Bob", "Carol", "David", "Eve", "Frank", "Grace", "Henry", "Iris", "Jack"],
                "subject_category": "PLANNING"
            }
        ]
    },
    "chunks": [
        {
            "chunk_id": 44,
            "meeting_id": 6,
            "meeting_title": "Q2 Sprint Planning",
            "meeting_time": "2026-05-11 16:01:11",
            "subject_category": "SPRINT_PLANNING"
        }
    ]
}

MOCK_DOWNLOAD_URL_RESPONSE = {
    "meeting_id": 6,
    "download_url": "https://your-bucket.cos.ap-guangzhou.myqcloud.com/recordings/rec_006.wav?X-Amz-Expires=900&X-Amz-Signature=mock",
    "expires_in": 900
}
