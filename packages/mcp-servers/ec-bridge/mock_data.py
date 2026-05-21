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

MOCK_FETCH_TRANSCRIPTS_RESPONSE = {
    "transcripts": {
        "Q2 Sprint Planning": (
            "[2026-05-11 16:01] 主持人：好，大家都到了，我们开始今天的 Q2 冲刺计划会议。\n"
            "[16:02] Alice：本季度我们主要推进三个模块：用户画像、推荐引擎和数据管道优化。\n"
            "[16:05] Bob：数据管道那边上周刚完成压测，P99 延迟从 420ms 降到了 180ms。\n"
            "[16:08] Carol：推荐引擎的 AB 实验还在跑，预计下周五出结论。\n"
            "[16:15] 主持人：好，那我们把推荐引擎的上线节点定在 5 月 28 日，Carol 你来跟进。\n"
            "[16:20] Alice：用户画像这边需要数据团队配合，Bob 能安排一下吗？\n"
            "[16:22] Bob：没问题，我这边下周二对齐一下需求。\n"
            "[16:30] 主持人：好，今天就到这里，下次会议定在两周后。"
        ),
        "AI Integration Review": (
            "[2026-05-12 14:00] 主持人：今天主要评审 AI 模块集成方案，请 Alice 先介绍背景。\n"
            "[14:01] Alice：我们计划把 LLM 接入客服系统，第一期覆盖 FAQ 自动回复。\n"
            "[14:08] David：模型选型上我们对比了三个方案，综合延迟和成本，倾向用私有化部署。\n"
            "[14:15] Bob：私有化部署的运维成本怎么算？GPU 资源怎么规划？\n"
            "[14:18] David：按当前并发量，2 张 A100 够用，预算大概 8 万/月。\n"
            "[14:25] Alice：安全合规那边有没有要求？\n"
            "[14:27] Carol：数据不能出境，所以私有化部署是必选项。\n"
            "[14:35] 主持人：那就确定私有化方案，David 下周出详细技术方案，Carol 跟进合规审查。"
        ),
    }
}
