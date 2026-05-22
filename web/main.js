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
      'fetch_meeting_content',
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
    id: 'meeting-insights',
    type: 'skill',
    icon: '💡',
    name: '会议洞察',
    description: '对指定会议或时间段内的会议进行深度分析，提取关键决策、行动项和讨论要点。',
    author: 'seekseek',
    tags: ['meeting-insights'],
    tools: ['search_recordings', 'fetch_meeting_content'],
    examples: [
      '帮我总结上周所有关于产品规划的会议',
      '这次会议里有哪些重要决策？',
      '找出最近一个月里提到 XX 项目的会议要点',
    ],
  },
  {
    id: 'smart-schedule',
    type: 'skill',
    icon: '📅',
    name: '智能日程',
    description: '从会议逐字稿中自动识别时间节点、任务分配和截止日期，生成结构化的日程提醒列表。',
    author: 'seekseek',
    tags: ['smart-schedule'],
    tools: ['fetch_meeting_content'],
    examples: [
      '从今天的会议里提取所有需要跟进的任务',
      '帮我整理本周会议里提到的 deadline',
      '把会议里提到的行动项整理成日程',
    ],
  },
  {
    id: 'weekly-review',
    type: 'skill',
    icon: '📊',
    name: '每周回顾',
    description: '自动检索本周所有会议录音，按项目或主题聚合，生成结构化的每周回顾报告。',
    author: 'seekseek',
    tags: ['weekly-review'],
    tools: ['search_recordings'],
    examples: [
      '帮我生成本周的会议回顾',
      '总结这周各个项目的进展情况',
      '本周有哪些会议，分别讨论了什么',
    ],
  },
  {
    id: 'performance-summary',
    type: 'skill',
    icon: '📈',
    name: '绩效总结',
    description: '从历史会议记录中提取项目进展、个人贡献和团队成果，辅助生成绩效总结材料。',
    author: 'seekseek',
    tags: ['performance-summary'],
    tools: ['search_recordings', 'fetch_meeting_content'],
    examples: [
      '帮我从最近三个月的会议里整理我的工作亮点',
      '总结 Q2 期间 XX 项目的推进情况',
      '从会议记录里找出团队的主要成果',
    ],
  },
  {
    id: 'discovery',
    type: 'skill',
    icon: '🌐',
    name: '发现',
    description: '跨会议全局搜索，发现反复出现的问题、未被跟进的议题或潜在的机会点。',
    author: 'seekseek',
    tags: ['discovery'],
    tools: ['search_recordings'],
    examples: [
      '最近的会议里有哪些问题被反复提到但没有解决',
      '找出所有提到客户反馈的会议片段',
      '有哪些讨论了很久但还没有结论的议题',
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
