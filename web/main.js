const mcpServers = [
  {
    id: 'ec-bridge',
    type: 'mcp',
    icon: '🔌',
    name: 'EC Bridge',
    description: '基于语义搜索的会议录音检索服务，支持全文检索、录音下载与逐字稿获取。',
    author: 'seekseek',
    tags: ['ec-bridge'],
    tools: [
      'search_recordings',
      'fetch_transcripts',
      'get_recording_download_url',
      'set_save_directory',
      'save_search_result',
    ],
    examples: [
      '帮我搜索上周关于产品规划的会议',
      '下载这次会议的录音文件',
      '把今天会议的逐字稿保存到本地',
    ],
  },

];

const skills = [
  {
    id: 'intel-briefing',
    type: 'skill',
    icon: '📡',
    name: '情报简报',
    description: '根据笔记或关注话题，通过联网搜索生成个性化结构化情报简报，包含核心焦点、延伸阅读、生活美学和每日必读四个板块。',
    author: 'seekseek',
    tags: ['intel-briefing'],
    tools: ['WebSearch'],
    examples: [
      '帮我搜一下关于 AI Agent 的最新进展',
      '生成情报简报',
      '根据我的笔记看看有什么新的相关信息',
    ],
  },
  {
    id: 'story-workshop',
    type: 'skill',
    icon: '✍️',
    name: '故事工坊',
    description: '把真实经历、日常片段或想法，创作成有文学质感的故事内容——小说章节、散文、短篇故事或沉浸式叙事均可。',
    author: 'seekseek',
    tags: ['story-workshop'],
    tools: [],
    examples: [
      '把这段经历写成故事',
      '帮我写一篇以 X 为主角的小说',
      '根据我的记录生成一个有意思的故事',
    ],
  },
  {
    id: 'trip-planner',
    type: 'skill',
    icon: '🗺️',
    name: '行程规划',
    description: '根据位置、时间、人数和偏好，通过联网搜索生成具体可执行的行程建议，含餐厅、景点、活动推荐（带地址和理由）。',
    author: 'seekseek',
    tags: ['trip-planner'],
    tools: ['WebSearch'],
    examples: [
      '帮我规划一下今天的行程',
      '我在北京朝阳区，推荐几个吃饭的地方',
      '周末去哪玩，两个人，预算不限',
    ],
  },
  {
    id: 'weekly-report',
    type: 'skill',
    icon: '📋',
    name: '周报生成',
    description: '将一周的笔记、日志、任务记录聚合成结构化周报，提取主题趋势、亮点事件、未竟事项和下周重点。',
    author: 'seekseek',
    tags: ['weekly-report'],
    tools: [],
    examples: [
      '帮我写周报',
      '总结一下这周',
      '把本周记录整理成可以发出去的周报',
    ],
  },
  {
    id: 'work-reviewer',
    type: 'skill',
    icon: '🔄',
    name: '进展复盘',
    description: '将工作笔记、会议记录或任务列表转化为阶段性复盘报告，分战功（可量化成果）和内功（协作/成长/流程）两个维度，以第一人称撰写。',
    author: 'seekseek',
    tags: ['work-reviewer'],
    tools: [],
    examples: [
      '帮我写复盘',
      '总结一下最近的工作',
      '帮我整理这段时间做了什么，输出绩效总结',
    ],
  },
  {
    id: 'elevenlabs',
    type: 'skill',
    icon: '🎙️',
    name: 'ElevenLabs 语音合成',
    description: '基于 ElevenLabs 的语音生成工具，支持文本转语音、声音克隆、批量转换和音效生成，无需额外依赖，开箱即用。',
    author: 'kortix-ai',
    tags: ['elevenlabs'],
    tools: [],
    examples: [
      '帮我把这段文字转成语音',
      '生成一段音频："今天天气不错"',
      '克隆我的声音并朗读这段内容',
    ],
  },
  {
    id: 'skill-creator',
    type: 'skill',
    icon: '🛠️',
    name: 'Skill 创作台',
    description: '从零创建新 skill、迭代优化现有 skill、运行 eval 评测、分析性能基准，并优化 skill description 以提升触发准确率。',
    author: 'anthropic',
    tags: ['skill-creator'],
    tools: [],
    examples: [
      '我想创建一个用于 XX 场景的 skill',
      '帮我优化这个 skill 的 description',
      '对现有 skill 跑一次 eval 测试',
    ],
  },
  {
    id: 'ai-debate',
    type: 'skill',
    icon: '⚔️',
    name: 'AI 辩论赛',
    description: '从录音中提取对立观点，生成辩题和双方论点，与 AI 模拟对练辩论，并获得裁判视角的多维评分与改进建议。',
    author: 'Xiaomi AI Team',
    tags: ['ai-debate'],
    tools: [],
    examples: [
      '来一场 AI 辩论',
      '模拟辩论赛，主题是端侧 AI 还是云端 AI',
      '帮我练习辩论，分析我的论证逻辑',
    ],
  },
  {
    id: 'annual-report',
    type: 'skill',
    icon: '📊',
    name: '年度述职生成',
    description: '聚合全年录音与工作记录，提取项目成果、关键决策、成长轨迹，一键生成可直接用于述职的结构化年度报告。',
    author: 'Xiaomi AI Team',
    tags: ['annual-report'],
    tools: [],
    examples: [
      '生成年度述职报告',
      '总结今年的工作成果',
      '帮我整理全年项目，生成述职 PPT 大纲',
    ],
  },
  {
    id: 'career-coach',
    type: 'skill',
    icon: '🎯',
    name: '职业教练',
    description: '基于工作录音提供职业发展建议、沟通能力分析和领导力训练，AI 教练随叫随到，帮你识别盲区、制定成长路径。',
    author: 'Xiaomi AI Team',
    tags: ['career-coach'],
    tools: [],
    examples: [
      '给我职业发展建议',
      '分析我的沟通风格，有什么问题',
      '我适合做管理吗？帮我评估一下',
    ],
  },
  {
    id: 'celebrity-chat',
    type: 'skill',
    icon: '🌟',
    name: '名人对谈',
    description: '会后听名人点评：如果乔布斯、马斯克、雷军来参会，他会怎么说？纯 LLM 人格模拟，无需外部 API，开箱即用。',
    author: 'Xiaomi AI Team',
    tags: ['celebrity-chat'],
    tools: [],
    examples: [
      '如果是乔布斯来参会，他会怎么说',
      '让雷军来点评这个产品方案',
      '马斯克怎么看我们的技术路线',
    ],
  },
  {
    id: 'emotional-palette',
    type: 'skill',
    icon: '🎨',
    name: '情绪调色板',
    description: '分析录音中情绪变化的时间模式，生成情绪时间线与洞察，帮你发现压力高峰、情绪周期和潜在的心理规律。',
    author: 'Xiaomi AI Team',
    tags: ['emotional-palette'],
    tools: [],
    examples: [
      '分析我最近的情绪变化趋势',
      '画出我这周的情绪图',
      '我最近压力大吗？从录音里分析一下',
    ],
  },
  {
    id: 'letter-to-future',
    type: 'skill',
    icon: '💌',
    name: '给未来的信',
    description: '录一段话给未来的自己，AI 帮你整理成信件并记录当下状态，适合年末总结、重要节点的时间胶囊和自我对话。',
    author: 'Xiaomi AI Team',
    tags: ['letter-to-future'],
    tools: [],
    examples: [
      '给一年后的自己写封信',
      '记录一下今天的心情，以后回看',
      '把这段录音整理成给未来自己的信',
    ],
  },
  {
    id: 'mindfulness-guide',
    type: 'skill',
    icon: '🧘',
    name: '正念引导',
    description: '根据录音中识别的压力和情绪模式，生成个性化冥想引导和呼吸练习脚本，帮你随时随地放松减压。',
    author: 'Xiaomi AI Team',
    tags: ['mindfulness-guide'],
    tools: [],
    examples: [
      '我压力好大，帮我放松一下',
      '来一段 5 分钟的正念引导',
      '给我一个呼吸练习，帮我平静下来',
    ],
  },
  {
    id: 'negotiation-review',
    type: 'skill',
    icon: '🤝',
    name: '谈判复盘器',
    description: '分析商务谈判录音，提取对方策略与话术，识别遗漏的机会点，生成结构化复盘报告和下次谈判的改进建议。',
    author: 'Xiaomi AI Team',
    tags: ['negotiation-review'],
    tools: [],
    examples: [
      '复盘刚才那场谈判',
      '分析对方在谈判中用了哪些策略',
      '我哪里可以争取更好的条件？',
    ],
  },
  {
    id: 'opening-remarks',
    type: 'skill',
    icon: '💬',
    name: '开场白建议',
    description: '会前智能破冰：分析过往共同经历，找到合适话题，生成自然得体的开场白建议，让初次或久违的会面不再尴尬。',
    author: 'Xiaomi AI Team',
    tags: ['opening-remarks'],
    tools: [],
    examples: [
      '待会要见老朋友，帮我想个开场白',
      '和好久没见的张总开会，说什么好',
      '帮我想几个破冰话题',
    ],
  },
  {
    id: 'oral-comics',
    type: 'skill',
    icon: '📖',
    name: '口述漫画',
    description: '用语言描述一个场景，AI 自动生成 4 格漫画分镜脚本和画面描述，配合图像生成 API 可直接输出漫画内容。',
    author: 'Xiaomi AI Team',
    tags: ['oral-comics'],
    tools: [],
    examples: [
      '把今天的会议变成一个漫画故事',
      '描述一个场景，帮我生成 4 格漫画',
      '用漫画形式呈现这个产品发布的过程',
    ],
  },
  {
    id: 'personality-test-pro',
    type: 'skill',
    icon: '🧠',
    name: '性格测试 Pro',
    description: '分析全量录音中的语言模式、情绪反应和决策方式，生成深度性格分析报告，比问卷测试更真实、更有洞察。',
    author: 'Xiaomi AI Team',
    tags: ['personality-test-pro'],
    tools: [],
    examples: [
      '分析我的性格特征',
      '我是什么类型的人？从录音里判断一下',
      '帮我生成深度性格报告',
    ],
  },
  {
    id: 'resume-generator',
    type: 'skill',
    icon: '📄',
    name: '简历生成',
    description: '从历史录音和工作记录中提取技能、项目经历和量化成就，生成结构化简历片段，随时保持简历与实际工作同步。',
    author: 'Xiaomi AI Team',
    tags: ['resume-generator'],
    tools: [],
    examples: [
      '帮我写简历',
      '从最近的录音里提取简历素材',
      '更新我的简历，把最近的项目加进去',
    ],
  },
  {
    id: 'social-graph',
    type: 'skill',
    icon: '🕸️',
    name: '社交分析图谱',
    description: '从录音中构建人物-项目-概念关系网络，分析人脉动态和互动策略，帮你识别关键连接人和待维护的重要关系。',
    author: 'Xiaomi AI Team',
    tags: ['social-graph'],
    tools: [],
    examples: [
      '分析我的人脉关系网络',
      '我和谁合作最多？画出社交图谱',
      '最近哪些重要关系需要我维护一下',
    ],
  },
  {
    id: 'voice-clone-vc',
    type: 'skill',
    icon: '🔊',
    name: '声纹克隆·百变声优',
    description: '用 30 秒录音克隆任何人声音，支持 6 种情感语调、120+ 语言，让 AI 用你选择的声音播报会议总结、待办或报告。',
    author: 'Xiaomi AI Team',
    tags: ['voice-clone-vc'],
    tools: [],
    examples: [
      '用雷军的声音帮我播报今天的待办',
      '克隆我的声音，朗读这份报告',
      '声纹克隆，用乔布斯的风格点评这个方案',
    ],
  },
];

async function runAction(action, item) {
  const logEl = document.getElementById('install-log');
  const logText = document.getElementById('install-log-text');
  const installBtn = document.getElementById('install-confirm-btn');
  const uninstallBtn = document.getElementById('uninstall-confirm-btn');

  const isMcp = item.type === 'mcp';
  const actionLabel = action === 'uninstall' ? '正在卸载' : '正在安装';

  logEl.style.display = 'block';
  logText.className = 'install-log-text log-running';
  logText.textContent = `${actionLabel} ${item.name}…`;
  installBtn.disabled = true;
  uninstallBtn.disabled = true;

  const endpoint = isMcp ? '/api/mcp-install' : `/api/${action}`;
  const body = isMcp ? { mcp_id: item.id } : { skill_id: item.id };
  const errorLines = [];

  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    let success = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const parts = buf.split('\n');
      buf = parts.pop();
      for (const line of parts) {
        if (line === '__OK__') { success = true; }
        else if (line.startsWith('__FAIL__')) { success = false; errorLines.push(line.replace('__FAIL__: ', '')); }
        else if (line && !success) { errorLines.push(line); }
      }
    }

    logText.className = 'install-log-text ' + (success ? 'log-success' : 'log-error');
    logText.textContent = success
      ? (action === 'uninstall' ? `已卸载 ${item.name}` : `${item.name} 安装成功`)
      : (errorLines.join('\n') || '执行失败');
  } catch {
    logText.className = 'install-log-text log-error';
    logText.textContent = '无法连接本地服务，请先运行：python web/server.py';
  } finally {
    installBtn.disabled = false;
    uninstallBtn.disabled = false;
  }
}

let currentInstallItem = null;

function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  const badgeClass = item.type === 'mcp' ? 'badge-mcp' : 'badge-skill';
  const badgeText = item.type === 'mcp' ? 'MCP Server' : 'Skill';
  const iconClass = item.type === 'mcp' ? 'card-icon mcp' : 'card-icon';
  const installBtn = `<button class="install-btn" data-id="${item.id}">安装</button>`;

  card.innerHTML = `
    <div class="card-header">
      <div class="${iconClass}">${item.icon}</div>
      <div class="card-title-row">
        <span class="card-name">${item.name}</span>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
    </div>
    <p class="card-desc">${item.description}</p>
    <div class="card-footer">
      <span class="card-author">⚡ ${item.author}</span>
      <div class="card-tags">
        ${item.tags.map(t => `<span class="tag">#${t}</span>`).join('')}
      </div>
      ${installBtn}
    </div>
  `;

  card.querySelector('.card-header, .card-desc')?.addEventListener('click', () => openModal(item));
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.install-btn')) openModal(item);
  });

  const btn = card.querySelector('.install-btn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openInstallModal(item);
    });
  }

  return card;
}

function renderGrid(items, gridId) {
  const grid = document.getElementById(gridId);
  items.forEach(item => grid.appendChild(createCard(item)));
}

function openModal(item) {
  const iconClass = item.type === 'mcp' ? 'modal-icon mcp' : 'modal-icon';
  const badgeClass = item.type === 'mcp' ? 'badge-mcp' : 'badge-skill';
  const badgeText = item.type === 'mcp' ? 'MCP Server' : 'Skill';

  document.getElementById('modal-content').innerHTML = `
    <div class="modal-hero">
      <div class="${iconClass}">${item.icon}</div>
      <div>
        <div class="card-title-row" style="margin-bottom:6px">
          <span class="modal-title">${item.name}</span>
          <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
        <span class="card-author">⚡ ${item.author}</span>
      </div>
    </div>

    <p class="modal-desc">${item.description}</p>

    <div class="modal-section">
      <div class="modal-section-title">依赖工具</div>
      <div class="tool-list">
        ${item.tools.map(t => `<span class="tool-chip">${t}</span>`).join('')}
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">使用示例</div>
      <ul class="example-list">
        ${item.examples.map(e => `<li>${e}</li>`).join('')}
      </ul>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Tags</div>
      <div class="modal-tags">
        ${item.tags.map(t => `<span class="modal-tag">#${t}</span>`).join('')}
      </div>
    </div>
  `;

  document.getElementById('modal-overlay').classList.add('open');
}

function openInstallModal(item) {
  currentInstallItem = item;
  document.getElementById('install-modal-title').textContent = `安装 ${item.name}`;
  document.getElementById('install-modal-desc').textContent =
    item.type === 'mcp'
      ? '将运行 setup 脚本，把 MCP Server 注册到 Claude Code（user scope）。'
      : 'skill 将安装到当前项目的 .claude/skills/ 目录下。';
  document.getElementById('uninstall-confirm-btn').style.display = item.type === 'mcp' ? 'none' : '';
  document.getElementById('install-log').style.display = 'none';
  document.getElementById('install-modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function closeInstallModal() {
  document.getElementById('install-modal-overlay').classList.remove('open');
  currentInstallItem = null;
}

// Info modal events
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// Install modal events
document.getElementById('install-modal-close').addEventListener('click', closeInstallModal);
document.getElementById('install-modal-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeInstallModal();
});

document.getElementById('install-confirm-btn').addEventListener('click', () => {
  if (currentInstallItem) runAction('install', currentInstallItem);
});

document.getElementById('uninstall-confirm-btn').addEventListener('click', () => {
  if (currentInstallItem) runAction('uninstall', currentInstallItem);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeInstallModal();
  }
});

// Skills registry: existing entries keep their rich metadata (icon, examples, etc.)
// New skills not listed here are auto-discovered from the filesystem via /api/skills.
const skillRegistry = Object.fromEntries(skills.map(s => [s.id, s]));

async function loadSkills() {
  try {
    const resp = await fetch('/api/skills');
    if (!resp.ok) throw new Error('api error');
    const discovered = await resp.json();
    const discoveredMap = Object.fromEntries(discovered.map(s => [s.id, s]));
    const discoveredIds = new Set(discovered.map(s => s.id));

    // Keep registry order for known skills (only if they still exist on disk)
    const result = skills.filter(s => discoveredIds.has(s.id));
    const registryIds = new Set(result.map(s => s.id));

    // Append auto-discovered skills not in registry (new skills)
    for (const s of discovered) {
      if (!registryIds.has(s.id)) result.push(s);
    }
    return result;
  } catch {
    return skills; // fallback to hardcoded list if server not running
  }
}

renderGrid(mcpServers, 'mcp-grid');
loadSkills().then(list => renderGrid(list, 'skills-grid'));
