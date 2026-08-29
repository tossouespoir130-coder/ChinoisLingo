export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  youtubeId?: string;
  description?: string;
  keyPoints?: string;
  tip?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  instructor: string;
  level: string;
  category: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  description: string;
  thumbnailUrl?: string;
  lessons: LessonItem[];
}

export const initialCourses: CourseModule[] = [
  {
    "id": "course_claire_hsk1",
    "title": "Podcast HSK 1 : L’Histoire de Claire en Chine",
    "instructor": "Espoir Chinois",
    "level": "HSK 1",
    "category": "Podcast",
    "progress": 0,
    "totalLessons": 9,
    "completedLessons": 0,
    "thumbnailUrl": "https://i.ytimg.com/vi/AeO2lDhgbS0/maxresdefault.jpg",
    "description": "Suivez les aventures immersives de Claire en Chine à travers 12 épisodes pour maîtriser le vocabulaire, la prononciation et les situations réelles du quotidien au niveau HSK 1.",
    "lessons": [
      {
        "id": "claire_ep1",
        "title": "Épisode 1 : Claire arrive en Chine ✈️",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "AeO2lDhgbS0",
        "description": "Découvrez les premières expressions et salutations indispensables dès l’arrivée de Claire sur le sol chinois.",
        "keyPoints": "Salutations d’accueil (你好, 欢迎), exprimer la joie d’arriver en Chine et se présenter simplement.",
        "tip": "Écoutez attentivement les tons sur les mots de salutation pour adopter le bon rythme dès le premier épisode."
      },
      {
        "id": "claire_ep2",
        "title": "Épisode 2 : Claire à l’aéroport 🚕",
        "duration": "6 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "28gVEaq5cdg",
        "description": "Apprenez à vous orienter à l’aéroport, récupérer vos bagages et prendre un taxi en mandarin.",
        "keyPoints": "Demander son chemin (请问), indiquer une destination au chauffeur de taxi (去...) et demander le tarif.",
        "tip": "Ayez toujours l’adresse de votre destination écrite en caractères chinois sur votre téléphone à montrer au chauffeur."
      },
      {
        "id": "claire_ep3",
        "title": "Épisode 3 : Claire à l’hôtel 🏨",
        "duration": "6 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "wXG2xPhi-i8",
        "description": "Maîtrisez le vocabulaire pour effectuer son check-in à l’hôtel, demander sa clé de chambre et poser des questions pratiques.",
        "keyPoints": "Formalités de réception (住酒店, 房间), demander le code Wi-Fi et les horaires du petit-déjeuner.",
        "tip": "Le mot 房卡 (fángkǎ) désigne la carte magnétique de la chambre : très utile à la réception !"
      },
      {
        "id": "claire_ep4",
        "title": "Épisode 4 : Claire au restaurant 🍚",
        "duration": "7 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "7UoSroCRvRE",
        "description": "Les structures essentielles pour commander des plats chinois, exprimer ses goûts et demander l’addition.",
        "keyPoints": "Appeler le serveur (服务员), commander un plat (我要这个), préciser ses préférences alimentaires et demander l’addition (买单).",
        "tip": "L’expression « 买单 » (mǎidān) ou « 结账 » (jiézhàng) est universellement comprise dans tous les restaurants en Chine."
      },
      {
        "id": "claire_ep5",
        "title": "Épisode 5 : Claire prend le métro 🚇",
        "duration": "6 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "JO5mMaWNSIw",
        "description": "Comment acheter un titre de transport, lire les plans de ligne et se déplacer facilement dans le métro chinois.",
        "keyPoints": "Prendre le métro (坐地铁), acheter un ticket (买票), reconnaître les numéros de ligne et les stations de transfert.",
        "tip": "Le réseau de métro en Chine est moderne et très bien indiqué en Pinyin et anglais sur tous les panneaux."
      },
      {
        "id": "claire_ep6",
        "title": "Épisode 6 : Claire fait du shopping 🛍️",
        "duration": "7 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "GGDVgX6sV3s",
        "description": "Vocabulaire des achats, demander les prix, essayer des vêtements et négocier simplement.",
        "keyPoints": "Demander le prix (多少钱), exprimer qu’un article est trop cher (太贵了) et demander une réduction (便宜一点).",
        "tip": "Pratiquez l’intonation amicale lorsque vous demandez « 能便宜一点吗？» (Pouvez-vous baisser un peu le prix ?)."
      },
      {
        "id": "claire_ep7",
        "title": "Épisode 7 : Claire se promène au parc 🌳",
        "duration": "6 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "Nvnxxl_38vo",
        "description": "Dialogues du quotidien pour décrire la nature, parler de ses loisirs et échanger avec les passants dans un parc.",
        "keyPoints": "Décrire un lieu agréable (公园, 很漂亮), parler de ses activités de détente et saluer les personnes âgées qui pratiquent le Tai-chi.",
        "tip": "Les parcs chinois sont le cœur de la vie sociale matinale : un lieu idéal pour pratiquer son chinois oral."
      },
      {
        "id": "claire_ep8",
        "title": "Épisode 8 : Claire rencontre des amis chinois 👋",
        "duration": "7 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "VCd0zUjkCBg",
        "description": "Faire des présentations chaleureuses, parler de son pays d’origine et tisser ses premières amitiés en Chine.",
        "keyPoints": "Échanger ses contacts WeChat (加微信), parler de ses études, de son travail et inviter à boire un thé.",
        "tip": "L’expression « 很高兴认识你 » (Très heureux de faire votre connaissance) crée instantanément un lien chaleureux."
      },
      {
        "id": "claire_ep9",
        "title": "Épisode 9 : Claire parle de la météo 🌧️",
        "duration": "6 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "uBrOshCrlr0",
        "description": "Expressions indispensables pour parler du temps qu’il fait, de la pluie, du soleil et planifier ses activités.",
        "keyPoints": "Parler de la météo (天气), du beau temps (晴天), de la pluie (下雨), du chaud (热) et du froid (冷).",
        "tip": "Parler de la météo est une excellente phrase d’accroche (« icebreaker ») pour démarrer une conversation naturelle en chinois."
      }
    ]
  },
  {
    "id": "course_30_phrases",
    "title": "30 Phrases Indispensables pour Débuter en Chinois",
    "instructor": "Espoir Chinois",
    "level": "Débutant",
    "category": "Oral",
    "progress": 0,
    "totalLessons": 31,
    "completedLessons": 0,
    "thumbnailUrl": "https://i.ytimg.com/vi/VH6F5JvQmXE/maxresdefault.jpg",
    "description": "Le guide en 31 courtes vidéos pratiques animé par Espoir Chinois pour débloquer son expression orale, acquérir les réflexes essentiels et converser dès les premiers jours.",
    "lessons": [
      {
        "id": "phrase_1",
        "title": "Phrase #1 : Bonjour en Chinois (你好)",
        "duration": "1 min 30",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "VH6F5JvQmXE",
        "description": "Apprenez les différentes manières de saluer en chinois selon le contexte et l interlocuteur.",
        "keyPoints": "La salutation universelle 你好 (Nǐ hǎo) et sa forme polie 您好 (Nín hǎo).",
        "tip": "Le 3e ton sur 你 et 好 se transforme en 2e ton quand ils sont côte à côte !"
      },
      {
        "id": "phrase_2",
        "title": "Phrase #2 : Merci en Chinois (谢谢)",
        "duration": "1 min 45",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "Yi_8KKNudIg",
        "description": "Exprimer sa gratitude et ses remerciements chaleureux au quotidien en mandarin.",
        "keyPoints": "L expression 谢谢 (Xièxie) et 谢谢你 (Xièxie nǐ).",
        "tip": "Le second 谢谢 se prononce au ton neutre, léger et rapide."
      },
      {
        "id": "phrase_3",
        "title": "Phrase #3 : De Rien en Chinois (不客气)",
        "duration": "1 min 50",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "8CP0wpRAkl0",
        "description": "Répondre poliment après un remerciement en mandarin.",
        "keyPoints": "Dire 不客气 (Bù kèqi) et 不用谢 (Bú yòng xiè).",
        "tip": "不客气 signifie littéralement \"Ne faites pas de manières / Ne soyez pas si poli\"."
      },
      {
        "id": "phrase_4",
        "title": "Phrase #4 : Désolé en Chinois (对不起)",
        "duration": "1 min 40",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "Ctazu9vomy8",
        "description": "Formules d excuse et de politesse indispensables dans toute conversation.",
        "keyPoints": "L incontournable 对不起 (Duìbuqǐ) et 不好意思 (Bù hǎoyìsi).",
        "tip": "不好意思 s utilise souvent pour un petit embarras ou pour interpeller gentiment quelqu un."
      },
      {
        "id": "phrase_5",
        "title": "Phrase #5 : Ce n'est pas grave (没关系)",
        "duration": "1 min 35",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "83nG06OMYW0",
        "description": "Rassurer son interlocuteur et dédramatiser une situation en chinois.",
        "keyPoints": "L expression 没关系 (Méi guānxi) et 没事 (Méishì).",
        "tip": "没关系 est la réponse idéale et la plus courante après 对不起."
      },
      {
        "id": "phrase_6",
        "title": "Phrase #6 : D'accord en Chinois (好的)",
        "duration": "1 min 45",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "D_7beKwvcC4",
        "description": "Exprimer son accord, valider une proposition ou accepter une invitation.",
        "keyPoints": "L usage de 好的 (Hǎo de) et 行 (Xíng).",
        "tip": "好的 est l équivalent le plus naturel de \"D accord / C est noté\" dans la vie courante."
      },
      {
        "id": "phrase_7",
        "title": "Phrase #7 : Dire NON en Chinois (不 / 不是)",
        "duration": "1 min 30",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "NB2hMvb1Vts",
        "description": "Comment refuser poliment et dire \"Non\" en mandarin sans ambiguïté.",
        "keyPoints": "L emploi de 不是 (Bú shì) et 不要 (Bú yào).",
        "tip": "En chinois, le mot pour \"non\" s adapte au verbe de la question posée."
      },
      {
        "id": "phrase_8",
        "title": "Phrase #8 : Dire OUI en Chinois (是 / 对)",
        "duration": "1 min 40",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "olb8zKbkm-E",
        "description": "Confirmer une information et dire \"Oui\" naturellement en chinois.",
        "keyPoints": "L usage de 是的 (Shì de), 对 (Duì) et 好 (Hǎo).",
        "tip": "Le mot 对 (Duì, \"Exact / C est vrai\") est extrêmement fréquent à l oral."
      },
      {
        "id": "phrase_9",
        "title": "Phrase #9 : Le mot OK en Chinois (行 / 可以)",
        "duration": "1 min 35",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "8sVHmzQUzcw",
        "description": "Dire \"OK\" ou marquer son approbation dans les échanges informels.",
        "keyPoints": "Les nuances entre 没问题 (Méi wèntí) et OK / 可以 (Kěyǐ).",
        "tip": "没问题 (\"Pas de problème\") rassure immédiatement votre interlocuteur."
      },
      {
        "id": "phrase_10",
        "title": "Phrase #10 : Au revoir en Chinois (再见)",
        "duration": "1 min 45",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "ZUVEfor_dXI",
        "description": "Prendre congé et saluer lors du départ en chinois.",
        "keyPoints": "La formule classique 再见 (Zàijiàn) et 明天见 (Míngtiān jiàn).",
        "tip": "再见 signifie littéralement \"Au plaisir de se revoir\" (再 = à nouveau, 见 = voir)."
      },
      {
        "id": "phrase_11",
        "title": "Phrase #11 : Je m'appelle (我叫)",
        "duration": "2 min 00",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "5U3gOBpbr7c",
        "description": "Se présenter par son prénom et nom de famille en mandarin.",
        "keyPoints": "La structure 我叫 (Wǒ jiào + prénom).",
        "tip": "Pour donner son nom complet, on dit souvent \"我叫 [Nom Prénom]\"."
      },
      {
        "id": "phrase_12",
        "title": "Phrase #12 : Demander le nom (你叫什么名字) Phrase chinoise du jour 12",
        "duration": "1 min 55",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "PlYDizx6GN8",
        "description": "Demander poliment l identité ou le nom de son interlocuteur.",
        "keyPoints": "La question 你叫什么名字？(Nǐ jiào shénme míngzi?).",
        "tip": "En contexte professionnel, privilégiez 您贵姓？(Nín guìxìng ?)."
      },
      {
        "id": "phrase_13",
        "title": "Phrase #13 : Je suis Français (我是法国人)",
        "duration": "1 min 50",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "21TFq8wbKP0",
        "description": "Exprimer sa nationalité et son pays d origine en chinois.",
        "keyPoints": "La structure 我是...人 (Wǒ shì Fǎguó rén).",
        "tip": "Ajoutez simplement le caractère 人 (rén, personne) après le nom du pays !"
      },
      {
        "id": "phrase_14",
        "title": "Phrase #14 : Je ne parle pas chinois (我不会说中文)",
        "duration": "1 min 45",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "-6VqG_nyJAk",
        "description": "Signaler que l on débute ou qu on ne maîtrise pas la langue.",
        "keyPoints": "La phrase 我不会说中文 (Wǒ bú huì shuō zhōngwén).",
        "tip": "Une phrase indispensable pour les premiers voyages en Chine."
      },
      {
        "id": "phrase_15",
        "title": "Phrase #15 : Je parle un peu chinois (我会说一点儿)",
        "duration": "1 min 50",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "ubTwl8Ey6ug",
        "description": "Exprimer avec humilité son niveau d apprentissage du mandarin.",
        "keyPoints": "La structure 我会说一点儿中文 (Wǒ huì shuō yìdiǎnr zhōngwén).",
        "tip": "Les locuteurs natifs apprécient énormément cet effort d expression."
      },
      {
        "id": "phrase_16",
        "title": "Phrase #16 : Combien ça coûte ? (多少钱)",
        "duration": "2 min 00",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "zviSGALoWDc",
        "description": "Demander le prix d un article au marché ou en magasin.",
        "keyPoints": "La question essentielle 这个多少钱？(Zhège duōshao qián?).",
        "tip": "Pointez du doigt l article en disant \"这个\" (zhège = celui-ci)."
      },
      {
        "id": "phrase_17",
        "title": "Phrase #17 : C'est trop cher ! (太贵了)",
        "duration": "1 min 45",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "usIbweA8k1w",
        "description": "Exprimer qu un tarif est élevé lors d une négociation.",
        "keyPoints": "La structure exclamative 太贵了！(Tài guì le!).",
        "tip": "L adverbe 太...了 (tài... le) sert à exprimer l excès avec force."
      },
      {
        "id": "phrase_18",
        "title": "Phrase #18 : Baisser le prix (能便宜一点吗)",
        "duration": "2 min 10",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "7tz_g7fO28o",
        "description": "Négocier une réduction de prix avec le commerçant.",
        "keyPoints": "L expression 能便宜一点吗？(Néng piányi yìdiǎn ma?).",
        "tip": "Toujours garder un ton souriant et courtois pendant la négociation."
      },
      {
        "id": "phrase_19",
        "title": "Phrase #19 : Où sont les toilettes ? (洗手间在哪里)",
        "duration": "1 min 40",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "ndMwdIPhEjQ",
        "description": "Demander où se trouvent les commodités dans un lieu public.",
        "keyPoints": "La question 洗手间在哪里？(Xǐshǒujiān zài nǎlǐ?).",
        "tip": "洗手间 (xǐshǒujiān) est le terme moderne et poli pour désigner les toilettes."
      },
      {
        "id": "phrase_20",
        "title": "Phrase #20 : Je veux ça ! (我要这个)",
        "duration": "1 min 35",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "1XGuzZIEs1c",
        "description": "Commander ou choisir un article précis au restaurant ou en boutique.",
        "keyPoints": "La formule directe 我要这个 (Wǒ yào zhège).",
        "tip": "我要 est parfait pour commander au restaurant en montrant le menu."
      },
      {
        "id": "phrase_21",
        "title": "Phrase #21 : Je ne comprends pas (我听不懂)",
        "duration": "1 min 40",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "QTk73_9PUB4",
        "description": "Indiquer que l on n a pas saisi une phrase ou une explication.",
        "keyPoints": "La phrase 我听不懂 (Wǒ tīng bù dǒng).",
        "tip": "听不懂 signifie spécifiquement \"Je n ai pas compris ce que j ai entendu\"."
      },
      {
        "id": "phrase_22",
        "title": "Phrase #22 : Parlez plus lentement (请说慢一点)",
        "duration": "1 min 50",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "mMG3CXIyOaI",
        "description": "Demander à son interlocuteur de ralentir son débit de parole.",
        "keyPoints": "La phrase 请说慢一点 (Qǐng shuō màn yìdiǎn).",
        "tip": "Le mot 请 (qǐng, \"s il vous plaît\") placé en tête adoucit la demande."
      },
      {
        "id": "phrase_23",
        "title": "Phrase #23 : Pas de problème ! (没问题)",
        "duration": "1 min 30",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "zKTbnVsO7Jw",
        "description": "Rassurer et confirmer la faisabilité d un service.",
        "keyPoints": "L expression 没问题 (Méi wèntí).",
        "tip": "Une des expressions les plus positives et chaleureuses en chinois."
      },
      {
        "id": "phrase_24",
        "title": "Phrase #24 : C'est génial ! (太棒了)",
        "duration": "1 min 45",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "-alQlrbfEGE",
        "description": "Exprimer son enthousiasme et son admiration.",
        "keyPoints": "L expression 太棒了！(Tài bàng le!).",
        "tip": "Utilisez 太棒了 pour féliciter quelqu un ou célébrer une bonne nouvelle."
      },
      {
        "id": "phrase_25",
        "title": "Phrase #25 : J'ai compris (我明白了)",
        "duration": "1 min 35",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "jzm9CGZUg3s",
        "description": "Confirmer que le message ou la consigne a bien été assimilée.",
        "keyPoints": "L expression 我明白了 (Wǒ míngbai le) ou 我懂了 (Wǒ dǒng le).",
        "tip": "我明白了 montre que vous avez clairement assimilé l explication."
      },
      {
        "id": "phrase_26",
        "title": "Phrase #26 : Je ne sais pas (我不知道)",
        "duration": "1 min 40",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "VRLaBqVD8ZY",
        "description": "Exprimer simplement son ignorance ou son manque d information.",
        "keyPoints": "La phrase 我不知道 (Wǒ bù zhīdào).",
        "tip": "Le verbe 知道 (zhīdào) signifie \"savoir / être au courant\"."
      },
      {
        "id": "phrase_27",
        "title": "Phrase #27 : Plus vite ! (快一点)",
        "duration": "1 min 40",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "pLCvHYsS3Rc",
        "description": "Encourager ou demander d accélérer une action.",
        "keyPoints": "L expression 快一点 (Kuài yìdiǎn).",
        "tip": "快 (kuài) signifie rapide, vite. 快一点 = un peu plus vite."
      },
      {
        "id": "phrase_28",
        "title": "Phrase #28 : Quelle heure est-il ? (现在几点了)",
        "duration": "2 min 00",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "6MeoqHMXdP4",
        "description": "Demander l heure courante à quelqu un.",
        "keyPoints": "La question 现在几点了？(Xiànzài jǐ diǎn le?).",
        "tip": "现在 (xiànzài) = maintenant, 几点 (jǐ diǎn) = quelle heure."
      },
      {
        "id": "phrase_29",
        "title": "Phrase #29 : Bonne Chance ! (祝你好运)",
        "duration": "1 min 45",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "fnGrBz9earo",
        "description": "Souhaiter de la chance et du succès à un proche ou collègue.",
        "keyPoints": "L expression 祝你好运 (Zhù nǐ hǎoyùn).",
        "tip": "Le caractère 运 (yùn) fait référence à la chance et au destin favorable."
      },
      {
        "id": "phrase_30",
        "title": "Phrase #30 : Attention ! (小心)",
        "duration": "1 min 35",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "6l3YIaiK_3w",
        "description": "Avertir d un danger ou inviter à la vigilance.",
        "keyPoints": "L expression 小心 (Xiǎoxīn) ou 注意 (Zhùyì).",
        "tip": "小心 signifie littéralement \"Petit cœur\" = faire attention, être prudent."
      },
      {
        "id": "phrase_31",
        "title": "Phrase #31 : Bon Courage ! (加油)",
        "duration": "1 min 50",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "V0Yel5HKVts",
        "description": "L encouragement le plus populaire et puissant de la culture chinoise.",
        "keyPoints": "L incontournable 加油！(Jiāyóu!).",
        "tip": "加油 signifie littéralement \"Ajoute de l essence !\", crié pour tout encouragement."
      }
    ]
  },
  {
    "id": "course_initiation_5_cours",
    "title": "Initiation au Chinois en 5 Vidéos",
    "instructor": "Espoir Chinois",
    "level": "Débutant",
    "category": "Bases",
    "progress": 0,
    "totalLessons": 5,
    "completedLessons": 0,
    "thumbnailUrl": "https://i.ytimg.com/vi/Uiou_ybQfwI/maxresdefault.jpg",
    "description": "La formation essentielle en 5 cours vidéo animée par Espoir Chinois pour poser des bases solides : maîtriser les salutations, dompter les tons et le pinyin, construire ses premières phrases et réussir son premier dialogue.",
    "lessons": [
      {
        "id": "init_ep1",
        "title": "Cours 1 : Les Salutations de Base (你好)",
        "duration": "12 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "Uiou_ybQfwI",
        "description": "Découvrez comment saluer avec assurance et politesse en chinois selon le contexte et le statut de votre interlocuteur.",
        "keyPoints": "Salutations fondamentales (你好, 您好, 你们好), la politesse chinoise et les réflexes d'accueil.",
        "tip": "Adoptez une posture souriante et prononcez 您好 (nín hǎo) avec respect face à une personne plus âgée ou un supérieur."
      },
      {
        "id": "init_ep2",
        "title": "Cours 2 : Les Tons et la Prononciation (Pinyin)",
        "duration": "15 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "GIryYof8YQ8",
        "description": "Maîtrisez les 4 tons du mandarin et le système Pinyin pour parler avec clarté sans déformer le sens des mots.",
        "keyPoints": "Les 4 tons indispensables (1er ton haut, 2e montant, 3e descendant-remontant, 4e descendant sec) + le ton neutre.",
        "tip": "Exagérez les mouvements de la voix au début pour bien ancrer la mémoire musculaire de chaque intonation."
      },
      {
        "id": "init_ep3",
        "title": "Cours 3 : Formule tes Premières Phrases (S + V + C)",
        "duration": "14 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "4opPC6tZWVE",
        "description": "Comprenez la structure logique et directe de la grammaire chinoise pour assembler vos premières phrases complètes.",
        "keyPoints": "L'ordre fondamental Sujet + Verbe + Complément, l'absence de conjugaison complexe et l'utilisation des pronoms (我, 你, 他/她).",
        "tip": "En chinois, pas de verbe irrégulier ni d'accord de genre : restez simple et direct dans l'agencement des mots !"
      },
      {
        "id": "init_ep4",
        "title": "Cours 4 : Présenter qui tu es (Nom, Nationalité, Métier)",
        "duration": "16 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "IjkKQpTv93A",
        "description": "Apprenez à vous présenter de manière fluide : donner votre prénom, votre nationalité et votre profession en mandarin.",
        "keyPoints": "La structure d'identité 我叫... (Wǒ jiào...), 我是...人 (Wǒ shì... rén) et 我是... (Wǒ shì...).",
        "tip": "Pratiquez votre auto-présentation devant un miroir pour gagner en naturel et en confiance orale."
      },
      {
        "id": "init_ep5",
        "title": "Cours 5 : Ton Premier Dialogue Réel",
        "duration": "18 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "WoyJ8PEpCjA",
        "description": "Mettez en pratique toutes les notions apprises dans un premier dialogue fluide et complet de la vie quotidienne.",
        "keyPoints": "Enchaîner salutation, présentation, questions réciproques et formule de congé (再见).",
        "tip": "Félicitations pour cette étape majeure ! Vous avez acquis les réflexes pour vos premiers échanges authentiques en chinois."
      }
    ]
  },
  {
    "id": "course_vocabulaire_hsk1_fondamental",
    "title": "Vocabulaire HSK 1 : Les Mots Clés Essentiels",
    "instructor": "Espoir Chinois",
    "level": "Débutant",
    "category": "Vocabulaire",
    "progress": 0,
    "totalLessons": 25,
    "completedLessons": 0,
    "thumbnailUrl": "https://i.ytimg.com/vi/ORNmYTnRgCg/maxresdefault.jpg",
    "description": "Une formation progressive animée par Espoir Chinois dans le but d’apprendre l’intégralité des 150 mots et expressions du HSK 1.",
    "lessons": [
      {
        "id": "vhsk1_ep1",
        "title": "Leçon 1 : Comment utiliser le verbe « Être » (是 shì) en Chinois",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "SfJy4OrUM_0",
        "description": "Maîtrisez le verbe d'état fondamental 是 (shì) et évitez le piège classique de l'employer devant les adjectifs.",
        "keyPoints": "Relier deux noms (我是老师, 他是中国人), la négation 不是 (bú shì), ne JAMAIS mettre 是 devant un adjectif qualificatif.",
        "tip": "Piège n°1 des débutants : ne dites jamais « 我是好 », mais « 我很好 » (pas de 是 devant les adjectifs simples) !"
      },
      {
        "id": "vhsk1_ep2",
        "title": "Leçon 2 : Comment utiliser le verbe « Avoir / Exister » (有 yǒu)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "ORNmYTnRgCg",
        "description": "Exprimez la possession (« j'ai ») et l'existence (« il y a ») avec 有 (yǒu), et découvrez sa négation unique 没有 (méiyǒu).",
        "keyPoints": "Possession (我有两本书), existence de lieu (这里有商店), la règle d'or : 有 se nie TOUJOURS avec 没 (没有) et JAMAIS avec 不.",
        "tip": "Règle absolue : « 不有 » n'existe pas en chinois. On dit obligatoirement 没有 (méiyǒu) !"
      },
      {
        "id": "vhsk1_ep3",
        "title": "Leçon 3 : Le Mot Chinois « Venir » (来 lái) en 5 Minutes",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "8H2U3XCTnEc",
        "description": "Apprenez à utiliser le verbe de mouvement fondamental 来 (lái) pour inviter, commander au restaurant ou indiquer un déplacement vers soi.",
        "keyPoints": "Le mouvement vers le locuteur (他来了), commander un plat (来一个... / 来两杯水), accueillir (请进来).",
        "tip": "Au restaurant en Chine, 来 (lái) est le verbe magique pour commander directement un plat au serveur !"
      },
      {
        "id": "vhsk1_ep4",
        "title": "Leçon 4 : Comment dire « Je / Moi » en Chinois (我 wǒ)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "VZymv8n5czw",
        "description": "Tout ce que vous devez savoir sur le pronom personnel indispensable 我 (wǒ) : prononciation, tracé et sandhi tonal.",
        "keyPoints": "Le 3e ton descendant-remontant (wǒ), le pluriel 我们 (wǒmen - nous), le changement de ton devant un autre 3e ton (wó hǎo).",
        "tip": "Quand deux 3es tons se suivent (ex: 我很好 wǒ hěn hǎo), le premier se prononce au 2e ton montant !"
      },
      {
        "id": "vhsk1_ep5",
        "title": "Leçon 5 : Le Mot Clé de Négation « Ne pas » (不 bù)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "nND1EkJt_MY",
        "description": "Maîtrisez la particule de négation universelle 不 (bù) et la règle de changement de ton devant un 4e ton.",
        "keyPoints": "Placer 不 directement devant le verbe ou l'adjectif (不去, 不好), la transformation de bù en bú devant un 4e ton (不是, 不要).",
        "tip": "Règle de prononciation : 不 devient 2e ton montant (bú) dès qu'il est suivi d'un mot au 4e ton !"
      },
      {
        "id": "vhsk1_ep6",
        "title": "Leçon 6 : Le Mot le Plus Facile en Chinois (一 yī / 好 hǎo)",
        "duration": "4 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "hjN7nYfse5c",
        "description": "Découvrez le tracé le plus épuré de la langue chinoise avec le chiffre 一 (yī - un trait horizontal) et ses variations de tons.",
        "keyPoints": "Le caractère 一 (yī), les changements de tons de 一 devant un 4e ton (yí gè) ou 1er/2e/3e ton (yì tiān).",
        "tip": "Devant un 4e ton, 一 se prononce au 2e ton montant (yí gè) : une mélodie naturelle à adopter !"
      },
      {
        "id": "vhsk1_ep7",
        "title": "Leçon 7 : Comment dire « OUI » en Chinois ?",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "h7M2sJTas4k",
        "description": "Découvrez pourquoi il n'y a pas un seul mot « oui » en chinois, mais comment confirmer selon le verbe de la question (是, 对, 好, 有, 行).",
        "keyPoints": "Confirmer avec le verbe de la question, employer 对 (duì - exact), 是 (shì - c'est ainsi) et 好 (hǎo - d'accord).",
        "tip": "En chinois, pour dire oui, reprenez simplement le verbe posé dans la question (ex: 去吗？ -> 去！)."
      },
      {
        "id": "vhsk1_ep8",
        "title": "Leçon 8 : Maîtrisez le Verbe « Aller » (去 qù) en Chinois",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "qx8uQAWLkSQ",
        "description": "Apprenez à indiquer vos déplacements, projets et destinations avec le verbe 去 (qù).",
        "keyPoints": "La structure Sujet + 去 + Lieu (我去中国, 我去学校), combiner avec une action (我去买东西).",
        "tip": "Attention au son 'u' avec tréma dans 'qù' : arrondissez les lèvres comme pour dire 'u' en français en poussant l'air."
      },
      {
        "id": "vhsk1_ep9",
        "title": "Leçon 9 : Améliorez votre Chinois avec le Verbe « Manger » (吃 chī)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "XMoS9w_Ugnw",
        "description": "Explorez le verbe au cœur de la convivialité chinoise 吃 (chī) et la célèbre salutation culturelle « As-tu mangé ? » (你吃了吗？).",
        "keyPoints": "Le verbe 吃 (1er ton haut), 吃中国菜 (manger chinois), 吃饭 (prendre son repas), la formule de salutation 你吃了吗？.",
        "tip": "Demander 你吃了吗？ (Nǐ chī le ma ?) en Chine équivaut à dire « Comment vas-tu ? » : une preuve d'attention chaleureuse !"
      },
      {
        "id": "vhsk1_ep10",
        "title": "Leçon 10 : Le mot « Regarder / Voir » (看 kàn)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "jtour7VhrDk",
        "description": "Maîtrisez le verbe polyvalent 看 (kàn) : regarder la télé, lire un livre, rendre visite ou consulter un médecin.",
        "keyPoints": "Les multiples usages de 看 : 看书 (lire), 看电视 (regarder la TV), 看朋友 (voir des amis), 看病 (aller chez le médecin).",
        "tip": "En chinois, lire un livre se dit littéralement « regarder le livre » (看书 kàn shū)."
      },
      {
        "id": "vhsk1_ep11",
        "title": "Leçon 11 : Le Verbe « Parler / Dire » (说 shuō) en 5 Minutes",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "oqxQR7awkHs",
        "description": "Apprenez à parler des langues, raconter et vous exprimer avec le verbe 说 (shuō).",
        "keyPoints": "Parler une langue (说中文, 说法语, 说英语), dire quelque chose (你说什么？, 他说得很好).",
        "tip": "Pour dire que vous parlez chinois, dites simplement : 我会说中文 (Wǒ huì shuō zhōngwén)."
      },
      {
        "id": "vhsk1_ep12",
        "title": "Leçon 12 : Le mot « Travailler / Travail » (工作 gōngzuò)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "6WAZFeyVZtg",
        "description": "Utilisez 工作 (gōngzuò) à la fois comme verbe (« je travaille ») et comme nom (« mon travail ») au quotidien.",
        "keyPoints": "La polyvalence nom/verbe (你在哪儿工作？, 我的工作很好), parler de son emploi et de son rythme de travail.",
        "tip": "Pas besoin de changer la forme du mot : 工作 s'emploie de la même manière comme nom ou comme verbe !"
      },
      {
        "id": "vhsk1_ep13",
        "title": "Leçon 13 : Comment utiliser le mot « Aimer / Apprécier » (喜欢 xǐhuan)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "gQMsiPyjSyM",
        "description": "Exprimez facilement vos goûts, vos préférences et vos passions avec le verbe 喜欢 (xǐhuan).",
        "keyPoints": "Sujet + 喜欢 + Objet/Verbe (我喜欢中国菜, 我喜欢学中文), la forme négative 不喜欢 (bù xǐhuan).",
        "tip": "喜欢 s'associe directement avec une activité sans préposition intermédiaire (ex: 我喜欢看电影)."
      },
      {
        "id": "vhsk1_ep14",
        "title": "Leçon 14 : Maîtrisez le mot « Aimer d'amour » (爱 ài) en Chinois",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "IhkhOKbTn4I",
        "description": "Comprenez l'intensité et l'usage profond du verbe 爱 (ài) par rapport à 喜欢 (xǐhuan).",
        "keyPoints": "La phrase universelle 我爱你 (Wǒ ài nǐ), exprimer une passion dévouée (我爱学习, 我爱中国), les nuances affectives.",
        "tip": "Le verbe 爱 est fort et profond en mandarin : pour les goûts du quotidien, préférez 喜欢 (xǐhuan)."
      },
      {
        "id": "vhsk1_ep15",
        "title": "Leçon 15 : Dire « Papa / Père » en Chinois (爸爸 bàba)",
        "duration": "4 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "c0sf_Q-zyQ0",
        "description": "Apprenez la prononciation exacte du mot 爸爸 (bàba) avec son 4e ton initial suivi du ton neutre léger.",
        "keyPoints": "Le schéma tonal 4e ton + ton neutre (bà-ba), parler de son père avec respect (我爸爸, 他爸爸), les expressions familiales.",
        "tip": "La 2e syllabe est toujours brève et légère (ton neutre) : ne marquez pas le 4e ton deux fois."
      },
      {
        "id": "vhsk1_ep16",
        "title": "Leçon 16 : Dire « Maman / Mère » en Chinois (妈妈 māma)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "k8rBus8qXcQ",
        "description": "Maîtrisez le mot doux et affectueux 妈妈 (māma) avec sa clé de la femme (女) et son 1er ton pur et mélodieux.",
        "keyPoints": "Le 1er ton haut et stable suivi du ton neutre (mā-ma), parler de sa maman (我妈妈, 祝妈妈节日快乐).",
        "tip": "Le premier caractère porte un 1er ton chantant et soutenu, le second s'atténue en ton neutre tout en douceur."
      },
      {
        "id": "vhsk1_ep17",
        "title": "Leçon 17 : Dire « Chien » en Chinois (狗 gǒu) : Prononciation & Exemples",
        "duration": "4 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "Ib_eVPioeA4",
        "description": "Apprenez le mot 狗 (gǒu), son classificateur d'animaux 只 (zhī) et des phrases pratiques sur les animaux de compagnie.",
        "keyPoints": "Le 3e ton descendant-remontant (gǒu), le spécificatif 一只狗 (yì zhī gǒu), phrases du quotidien (我家有一只小狗).",
        "tip": "Pensez toujours à associer le bon spécificatif 只 (zhī) lorsque vous comptez des animaux en mandarin."
      },
      {
        "id": "vhsk1_ep18",
        "title": "Leçon 18 : Le Mot « Chose / Objet » (东西 dōngxi) en 5 Minutes",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "DnGv2QCr6dI",
        "description": "Découvrez l'origine passionnante du mot 东西 (Est + Ouest = « les choses ») et l'expression indispensable faire des achats (买东西).",
        "keyPoints": "L'association d'orientations 东 (Est) et 西 (Ouest), le mot 买东西 (mǎi dōngxi - faire du shopping), désigner un objet (这个东西).",
        "tip": "Dans l'antiquité, les marchés de Chang'an se situaient à l'Est et à l'Ouest : aller à l'Est et à l'Ouest est devenu « acheter des choses » !"
      },
      {
        "id": "vhsk1_ep19",
        "title": "Leçon 19 : Dire « Restaurant » en Chinois (饭馆 fànguǎn / 饭店)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "GSgzL7Vjc7Q",
        "description": "Découvrez le vocabulaire de la restauration en Chine : 饭馆 (fànguǎn), 饭店 (fàndiàn) et comment demander où manger.",
        "keyPoints": "Désigner les lieux de restauration, demander un restaurant à proximité (这儿有饭馆吗？), inviter à manger (去饭馆吃饭).",
        "tip": "Le caractère 饭 (fàn) désigne le repas/riz et 馆 (guǎn) désigne un établissement : 饭馆 = le lieu où l'on prend le repas."
      },
      {
        "id": "vhsk1_ep20",
        "title": "Leçon 20 : Le mot LE PLUS IMPORTANT en Chinois (的 de)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "toGwPOlmrCA",
        "description": "Domptez la particule structurelle indispensable 的 (de) pour relier la possession, la description et les adjectifs aux noms.",
        "keyPoints": "La structure Posssesseur + 的 + Objet (我的书, 你的朋友) et la qualification Adjectif + 的 + Nom (很好的老师).",
        "tip": "La particule 的 est le mot le plus fréquent de toute la langue chinoise : placez-la toujours après ce qui qualifie ou possède."
      },
      {
        "id": "vhsk1_ep21",
        "title": "Leçon 21 : Comment exprimer la Possession en Chinois (的 de)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "zyoyTY3gF2g",
        "description": "Approfondissez les nuances de possession avec la particule 的 et apprenez dans quels cas affectifs elle peut être omise.",
        "keyPoints": "La possession explicite (妈妈的手机), l'omission naturelle pour les proches (我妈妈, 我家) et les structures raccourcies.",
        "tip": "Pour la famille très proche et les relations intimes, vous pouvez omettre 的 pour un rendu plus chaleureux et naturel."
      },
      {
        "id": "vhsk1_ep22",
        "title": "Leçon 22 : 3 Façons de dire NON en Chinois (不, 没, 别)",
        "duration": "6 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "i-CxDu0A714",
        "description": "Distinguez avec clarté les 3 négations majeures du chinois : 不 (bù - présent/volonté), 没 (méi - passé/avoir) et 别 (bié - impératif négatif).",
        "keyPoints": "不 pour refuser ou nier une habitude (我不去), 没 pour une action passée non accomplie (我没去), 别 pour interdire (别去).",
        "tip": "Retenez : 不 = « je ne veux pas / je ne fais pas habituellement », 没 = « je n'ai pas encore fait » !"
      },
      {
        "id": "vhsk1_ep23",
        "title": "Leçon 23 : Le mot « Savoir-faire / Pouvoir » (Partie 1 : 会 huì)",
        "duration": "6 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "C5ePtleCijY",
        "description": "Découvrez comment exprimer une compétence acquise par l’apprentissage ou la pratique grâce à 会 (huì).",
        "keyPoints": "Exprimer un savoir-faire (我会说汉语, 我会游泳) et exprimer une probabilité future (他会来).",
        "tip": "Retenez : si vous avez dû apprendre ou vous entraîner pour savoir le faire, employez systématiquement 会 (huì) !"
      },
      {
        "id": "vhsk1_ep24",
        "title": "Leçon 24 : Le mot « Pouvoir physique / Possibilité » (Partie 2 : 能 néng)",
        "duration": "5 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "-p3uWBh3xm4",
        "description": "Apprenez à utiliser le verbe modal 能 (néng) pour exprimer une capacité physique, une possibilité ou une circonstance favorable.",
        "keyPoints": "La capacité naturelle ou circonstancielle avec 能 (Wǒ néng...), la différence avec 会 (huì) et 可以 (kěyǐ).",
        "tip": "Utilisez 能 quand les conditions extérieures ou physiques vous permettent de réaliser l’action."
      },
      {
        "id": "vhsk1_ep25",
        "title": "Leçon 25 : Le mot « Avoir la permission / Pouvoir » (Partie 3 : 可以 kěyǐ)",
        "duration": "6 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "bdJIMGuRq_o",
        "description": "Comprenez l'usage de 可以 (kěyǐ) pour demander ou accorder une autorisation, ou suggérer une possibilité.",
        "keyPoints": "Demander poliment la permission (我可以进来吗？), donner son accord (可以！), exprimer une recommandation.",
        "tip": "Pour demander poliment « Est-ce que je peux... ? », démarrez toujours votre question par 我可以... 吗？"
      }
    ]
  },
  {
    "id": "course_13_verites_brutales",
    "title": "13 Vérités Brutales sur le Chinois Découvertes Trop Tard",
    "instructor": "Espoir Chinois",
    "level": "Tous Niveaux",
    "category": "Mindset",
    "progress": 0,
    "totalLessons": 1,
    "completedLessons": 0,
    "thumbnailUrl": "https://i.ytimg.com/vi/ofZRGvVEbCM/maxresdefault.jpg",
    "description": "Dans cette masterclass sans filtre, Espoir Chinois décortique les 13 pièges et erreurs critiques qui font perdre des mois aux apprenants : illusions courantes, mythes sur les caractères, mauvaises méthodes d'écoute et réflexes fondamentaux à adopter immédiatement pour réussir.",
    "lessons": [
      {
        "id": "verites_ep1",
        "title": "Masterclass : Les 13 Vérités Indispensables pour Réussir en Chinois",
        "duration": "22 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "ofZRGvVEbCM",
        "description": "Une analyse approfondie et sans concession des erreurs que la majorité des débutants commettent et finissent par regretter. Découvrez la méthode pour progresser rapidement sans vous décourager.",
        "keyPoints": "Éviter les erreurs de méthode, déconstruire les mythes sur la difficulté du mandarin, priorité à l'immersion orale et aux structures clés.",
        "tip": "Prenez des notes et appliquez dès aujourd'hui les ajustements stratégiques partagés par Espoir Chinois pour votre routine d'étude."
      }
    ]
  },
  {
    "id": "course_maitrise_tons_chinois",
    "title": "Maîtriser les Tons en Chinois pour Parler Couramment",
    "instructor": "Espoir Chinois",
    "level": "Débutant",
    "category": "Les 4 Tons",
    "progress": 0,
    "totalLessons": 1,
    "completedLessons": 0,
    "thumbnailUrl": "https://i.ytimg.com/vi/jwHJPyas6J4/maxresdefault.jpg",
    "description": "Une formation intensive dédiée au pilier absolu de la langue chinoise : domptez les 4 intonations et le ton neutre avec la méthode d'Espoir Chinois pour vous faire comprendre instantanément par les locuteurs natifs sans hésitation.",
    "lessons": [
      {
        "id": "tons_ep1",
        "title": "Masterclass : Dompter les 4 Tons du Mandarin et Parler Naturellement",
        "duration": "18 min",
        "isCompleted": false,
        "isLocked": false,
        "youtubeId": "jwHJPyas6J4",
        "description": "Guide complet et exercices pratiques pour prononcer chaque ton avec précision, comprendre les combinaisons de tons et surmonter définitivement la peur des tons.",
        "keyPoints": "Les 4 hauteurs mélodiques (1er, 2e, 3e, 4e ton), le ton neutre, les sandhis tonaux et l'entraînement vocal pour un accent impeccable.",
        "tip": "Répétez à voix haute en calquant votre intonation sur celle d'Espoir Chinois : la mémoire musculaire de la voix est la clé du succès !"
      }
    ]
  }
];
