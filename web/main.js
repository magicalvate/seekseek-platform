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
];

async function runAction(action, item) {
  const logEl = document.getElementById('install-log');
  const logText = document.getElementById('install-log-text');
  const installBtn = document.getElementById('install-confirm-btn');
  const uninstallBtn = document.getElementById('uninstall-confirm-btn');

  logEl.style.display = 'block';
  logText.className = 'install-log-text';
  logText.textContent = action === 'install' ? '正在安装...' : '正在卸载...';
  installBtn.disabled = true;
  uninstallBtn.disabled = true;

  try {
    const isMcp = item.type === 'mcp';
    const endpoint = isMcp ? '/api/mcp-install' : `/api/${action}`;
    const body = isMcp ? { mcp_id: item.id } : { skill_id: item.id };

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    logText.className = 'install-log-text ' + (data.success ? 'log-success' : 'log-error');
    logText.textContent = data.output;
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

renderGrid(mcpServers, 'mcp-grid');
renderGrid(skills, 'skills-grid');
