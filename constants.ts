import { Terminal, Globe, TrendingUp, Share2, Smartphone, BrainCircuit } from 'lucide-react';
import { EraData } from './types';

export const ERAS: EraData[] = [
  {
    id: 'genesis',
    title: '创世纪 THE GENESIS',
    period: '1969 - 1983',
    description: '冷战时代的寂静中，最初的节点连接建立。ARPANET 诞生，跨越虚空说出了第一句数字语言。In the silence of the cold war, the first nodes connected.',
    details: [
      "1969年10月29日，Leonard Kleinrock 教授在 UCLA 的实验室向斯坦福研究院 (SRI) 发送了第一条信息 'LO'（原本打算输入 'LOGIN'，但在输入两个字母后系统崩溃）。这微小的脉冲标志着 ARPANET 的诞生，它是现代互联网的前身。",
      "这一时期的核心创新是'分组交换' (Packet Switching)。不同于电话网络的电路交换，数据被切割成小块，通过不同的路径传输并在终点重组。这种去中心化的设计初衷是为了在核战争中保持指挥控制网络的生存能力，但最终它孕育了人类历史上最伟大的通信革命。",
      "On October 29, 1969, the first message 'LO' was sent from UCLA to SRI. The core innovation was 'Packet Switching', a decentralized design originally meant to survive nuclear war, which eventually birthed the internet."
    ],
    themeColor: '#00ff00',
    icon: Terminal,
    features: ['ARPANET', 'TCP/IP 协议', '第一封邮件 First Email', 'Telnet'],
    techStats: [
      { label: '带宽 Bandwidth', value: '56 kbps' },
      { label: '用户 Users', value: '< 1,000' },
      { label: '主机 Hosts', value: '213' }
    ]
  },
  {
    id: 'dawn',
    title: '万维网黎明 DAWN OF WWW',
    period: '1989 - 1995',
    description: 'Tim Berners-Lee 在 CERN 编织了网络。超文本连接了人类的知识。浏览器成为了我们观察世界的窗口。Hypertext connected humanity\'s knowledge.',
    details: [
      "在瑞士 CERN 的一台 NeXT 计算机上，Tim Berners-Lee 发明了万维网 (WWW)。他并没有为这项技术申请专利，而是将其免费通过 CERN 开放给世界，这一决定直接导致了网络的爆发式增长。",
      "HTML (超文本标记语言) 的出现让信息的组织方式从线性的书籍变成了网状的链接。Mosaic 浏览器的发布引入了图形界面，让非技术人员也能轻松通过“点击”来浏览信息。互联网从此不再是科学家和极客的专属领地，它开始向公众敞开大门。",
      "Tim Berners-Lee invented the WWW at CERN and gifted it to the world for free. The introduction of HTML and the graphical Mosaic browser transformed the internet from a command-line tool for scientists into a visual medium for the public."
    ],
    themeColor: '#b967ff',
    icon: Globe,
    features: ['HTML 1.0', 'Mosaic 浏览器', 'HTTP', '首个网站 First Website'],
    techStats: [
      { label: '网站 Websites', value: '23,500' },
      { label: '用户 Users', value: '16 Million' },
      { label: '领航 Nav', value: 'Netscape' }
    ]
  },
  {
    id: 'dotcom',
    title: '互联网泡沫 DOT-COM WAVE',
    period: '1995 - 2001',
    description: '数字边疆的淘金热。估值飞向月球又坠回地面。电子商务开始占据主导地位。Gold rush in the digital frontier.',
    details: [
      "这是一场资本的狂欢。只要公司名字里带有 '.com'，就能在纳斯达克获得惊人的估值。亚马逊、eBay 和雅虎定义了电子商务的早期形态。人们开始习惯在线购物，尽管那时的网络还需要忍受拨号连接的刺耳噪音。",
      "虽然 2000 年的泡沫破裂摧毁了数万亿美元的财富，但它并非毫无价值。在这期间铺设的大量光纤基础设施，为后来的高速宽带时代奠定了物理基础。那些在崩盘中幸存下来的公司（如 Amazon 和 Google），最终成为了统治世界的科技巨头。",
      "The Dot-com bubble was a capital frenzy where any '.com' company skyrocketed. Although the bubble burst in 2000 wiping out trillions, the fiber-optic infrastructure laid during this time paved the way for the broadband era."
    ],
    themeColor: '#ffff00',
    icon: TrendingUp,
    features: ['电子商务 E-Comm', 'Flash', '搜索引擎 Search', '泡沫 Bubble'],
    techStats: [
      { label: '纳斯达克 NASDAQ', value: '5,048 Peak' },
      { label: '拨号 Dial-up', value: '56k Modem' },
      { label: '上市 IPO', value: 'Everywhere' }
    ]
  },
  {
    id: 'web2',
    title: 'WEB 2.0 革命 REVOLUTION',
    period: '2004 - 2010',
    description: '静态网页变得社交化。用户成为创作者。世界通过动态流、点赞和关注连接在一起。The static web became social.',
    details: [
      "Web 2.0 标志着互联网从“只读”向“读写”的转变。用户不再是被动的内容消费者，而是内容的创造者 (UGC)。博客、维基百科、YouTube 和 Facebook 让每个人都拥有了麦克风。",
      "AJAX 技术让网页应用拥有了类似桌面软件的流畅体验，无需每次操作都刷新页面。算法开始介入我们的生活，根据我们的点击和喜好推荐内容。这种连接虽然拉近了世界的距离，但也开始形成了“回声室”效应和隐私问题。",
      "Web 2.0 shifted the internet from 'read-only' to 'read-write'. Users became creators via blogs and social media. AJAX technology made web apps smoother, while algorithms began to curate our digital reality."
    ],
    themeColor: '#00ffff',
    icon: Share2,
    features: ['社交媒体 Social', 'UGC', 'AJAX', '流媒体 Video'],
    techStats: [
      { label: 'Facebook', value: '500M Users' },
      { label: 'YouTube', value: 'Broadcast Yourself' },
      { label: '技术 Tech', value: 'RSS / API' }
    ]
  },
  {
    id: 'mobile',
    title: '移动与云 MOBILE & CLOUD',
    period: '2010 - 2020',
    description: '计算离开了桌面，进入了我们的口袋。数据升入云端。永恒的连接成为新常态。Computing entered our pockets.',
    details: [
      "iPhone 的出现和 Android 的普及将互联网装进了口袋。4G/LTE 网络让随时随地在线成为可能。App Store 经济创造了全新的商业模式，Uber、Instagram 和 TikTok 彻底改变了我们的生活方式。",
      "与此同时，计算能力从本地迁移到了“云端”。AWS 和 Azure 等云服务让初创公司可以用极低的成本获得巨大的算力。大数据开始被广泛用于分析人类行为，数字世界与物理世界的界限开始变得模糊。",
      "The smartphone era put the internet in our pockets, enabling an 'always-on' lifestyle. Cloud computing centralized processing power, while apps like Uber and Instagram redefined daily life and commerce."
    ],
    themeColor: '#ff003c',
    icon: Smartphone,
    features: ['4G/LTE', 'App 生态', '云存储 Cloud', '大数据 Big Data'],
    techStats: [
      { label: '智能手机 Phones', value: '3.5 Billion' },
      { label: '应用商店 Apps', value: '2M+ Apps' },
      { label: '云服务 Cloud', value: 'AWS / Azure' }
    ]
  },
  {
    id: 'future',
    title: 'AI 与元宇宙 METAVERSE',
    period: '2020 - Present',
    description: '合成智能遇上虚拟现实。我们站在新数字生存的悬崖边，去中心化且充满智慧。Synthetic intelligence meets virtual reality.',
    details: [
      "我们正处于一个新的奇点。生成式 AI (如 GPT) 展示了机器理解和创造语言的能力，甚至开始编写代码。Web3 技术试图通过区块链夺回数据的控制权，构建去中心化的价值网络。",
      "元宇宙的概念虽然仍在探索中，但 VR/AR 硬件的进步正在让“空间计算”成为可能。未来的互联网不再是屏幕上的像素，而是我们要进入的沉浸式空间。人类与机器的协作关系正在被重新定义。",
      "We are at a new singularity. Generative AI is demonstrating machine creativity, while Web3 attempts to decentralize data control. The future internet is not just on screens, but an immersive space we inhabit."
    ],
    themeColor: '#ffffff',
    icon: BrainCircuit,
    features: ['生成式 AI', 'Web3', 'VR/AR', '量子网络 Quantum'],
    techStats: [
      { label: '模型参数 Params', value: 'Trillions' },
      { label: '区块链 Chain', value: 'DeFi / NFT' },
      { label: '现实 Reality', value: 'Mixed' }
    ]
  }
];