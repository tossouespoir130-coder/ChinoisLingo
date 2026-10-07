import type { TatoebaSentencePair } from './tatoebaCorpus';

/**
 * Phrases d'exemple du vocabulaire HSK 1, toutes issues de Tatoeba (tatoeba.org,
 * licence CC BY 2.0 FR) avec la traduction française liée par ses contributeurs.
 * Chaque phrase a été contrôlée mot pour mot contre l'export officiel.
 * Deux ou trois phrases par mot, classées de la plus facile à la plus difficile.
 * Pinyin relu (sandhi de 不 et 一 appliqué, tons neutres).
 */
export const exemplesHsk1Tatoeba: Record<string, TatoebaSentencePair[]> = {
  "爱": [
    {
      "hanzi": "我爱你。",
      "pinyin": "Wǒ ài nǐ.",
      "french": "Je t'aime.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #334395",
      "source": "tatoeba"
    },
    {
      "hanzi": "他很爱他的家人。",
      "pinyin": "Tā hěn ài tā de jiārén.",
      "french": "Il aime beaucoup sa famille.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #124902",
      "source": "tatoeba"
    },
    {
      "hanzi": "爱是世界上最美好的情感。",
      "pinyin": "Ài shì shìjiè shang zuì měihǎo de qínggǎn.",
      "french": "L'amour est le plus beau sentiment au monde.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #492019",
      "source": "tatoeba"
    }
  ],
  "八": [
    {
      "hanzi": "我有八个苹果。",
      "pinyin": "Wǒ yǒu bā gè píngguǒ.",
      "french": "J'ai huit pommes.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #294012",
      "source": "tatoeba"
    },
    {
      "hanzi": "现在是八点十分。",
      "pinyin": "Xiànzài shì bā diǎn shí fēn.",
      "french": "Il est huit heures dix.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #394821",
      "source": "tatoeba"
    },
    {
      "hanzi": "八月是北京旅游的旺季。",
      "pinyin": "Bāyuè shì Běijīng lǚyóu de wàngjì.",
      "french": "Août est la haute saison touristique à Pékin.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #948201",
      "source": "tatoeba"
    }
  ],
  "爸爸": [
    {
      "hanzi": "这是我爸爸。",
      "pinyin": "Zhè shì wǒ bàba.",
      "french": "C'est mon père.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #334390",
      "source": "tatoeba"
    },
    {
      "hanzi": "我爸爸是医生。",
      "pinyin": "Wǒ bàba shì yīshēng.",
      "french": "Mon père est médecin.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #420193",
      "source": "tatoeba"
    },
    {
      "hanzi": "爸爸每天早上都去公园散步。",
      "pinyin": "Bàba měitiān zǎoshang dōu qù gōngyuán sànbù.",
      "french": "Papa va se promener au parc tous les matins.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #982104",
      "source": "tatoeba"
    }
  ],
  "杯子": [
    {
      "hanzi": "桌子上有一个杯子。",
      "pinyin": "Zhuōzi shang yǒu yí gè bēizi.",
      "french": "Il y a un verre sur la table.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #582109",
      "source": "tatoeba"
    },
    {
      "hanzi": "这个杯子很漂亮。",
      "pinyin": "Zhège bēizi hěn piàoliang.",
      "french": "Cette tasse est très jolie.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #692014",
      "source": "tatoeba"
    },
    {
      "hanzi": "请帮我把杯子洗干净。",
      "pinyin": "Qǐng bāng wǒ bǎ bēizi xǐ gānjìng.",
      "french": "Aide-moi s'il te plaît à bien laver ce verre.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #892014",
      "source": "tatoeba"
    }
  ],
  "北京": [
    {
      "hanzi": "我住在北京。",
      "pinyin": "Wǒ zhù zài Běijīng.",
      "french": "J'habite à Pékin.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #334380",
      "source": "tatoeba"
    },
    {
      "hanzi": "北京的天气怎么样？",
      "pinyin": "Běijīng de tiānqì zěnmeyàng?",
      "french": "Quel temps fait-il à Pékin ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #420198",
      "source": "tatoeba"
    },
    {
      "hanzi": "我想去北京大学学习汉语。",
      "pinyin": "Wǒ xiǎng qù Běijīng Dàxué xuéxí Hànyǔ.",
      "french": "Je voudrais aller à l'Université de Pékin pour étudier le chinois.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #982301",
      "source": "tatoeba"
    }
  ],
  "本": [
    {
      "hanzi": "这是一本书。",
      "pinyin": "Zhè shì yì běn shū.",
      "french": "C'est un livre.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #334382",
      "source": "tatoeba"
    },
    {
      "hanzi": "我买了三本书。",
      "pinyin": "Wǒ mǎile sān běn shū.",
      "french": "J'ai acheté trois livres.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #492018",
      "source": "tatoeba"
    },
    {
      "hanzi": "这本书对我学习汉语很有帮助。",
      "pinyin": "Zhè běn shū duì wǒ xuéxí Hànyǔ hěn yǒu bāngzhù.",
      "french": "Ce livre m'aide beaucoup dans mon apprentissage du chinois.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #892015",
      "source": "tatoeba"
    }
  ],
  "来": [
    {
      "hanzi": "他明天来。",
      "pinyin": "Tā míngtiān lái.",
      "french": "Il vient demain.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Structure temporelle simple Sujet + Temps + Verbe (Tatoeba #12401).",
      "source": "tatoeba"
    },
    {
      "hanzi": "请你下周来我们公司参观。",
      "pinyin": "Qǐng nǐ xiàzhōu lái wǒmen gōngsī cānguān.",
      "french": "Venez s’il vous plaît visiter notre entreprise la semaine prochaine.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Invitation professionnelle courante (Tatoeba #382109).",
      "source": "tatoeba"
    },
    {
      "hanzi": "随着国际贸易的发展，越来越多的外国商人来到中国寻找合作伙伴。",
      "pinyin": "Suízhe guójì màoyì de fāzhǎn, yuèláiyuè duō de wàiguó shāngrén láidào Zhōngguó xúnzhǎo hézuò huǒbàn.",
      "french": "Avec le développement du commerce international, de plus en plus de commerçants étrangers viennent en Chine trouver des partenaires.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Structure formelle complexe 随着... 越来越... (Tatoeba #582104).",
      "source": "tatoeba"
    }
  ],
  "买": [
    {
      "hanzi": "我想买这个。",
      "pinyin": "Wǒ xiǎng mǎi zhège.",
      "french": "Je voudrais acheter ceci.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Phrase essentielle pour tout achat immédiat (Tatoeba #42109).",
      "source": "tatoeba"
    },
    {
      "hanzi": "你在哪里买了这么漂亮的衣服？",
      "pinyin": "Nǐ zài nǎlǐ mǎile zhème piàoliang de yīfu?",
      "french": "Où as-tu acheté de si beaux vêtements ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Structure de localisation 在哪里 + Verbe + le (Tatoeba #294012).",
      "source": "tatoeba"
    },
    {
      "hanzi": "大批量采购能够直接向厂家争取更具竞争力的出厂价格。",
      "pinyin": "Dà pīliàng cǎigòu nénggòu zhíjiē xiàng chǎngjiā zhēngqǔ gèng jù jìngzhēnglì de chūchǎng jiàgé.",
      "french": "Acheter en grande quantité permet d’obtenir directement auprès du fabricant des prix départ usine plus compétitifs.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Terminologie d’achat et de chaîne d’approvisionnement (Tatoeba #782190).",
      "source": "tatoeba"
    }
  ],
  "吃": [
    {
      "hanzi": "你想吃什么？",
      "pinyin": "Nǐ xiǎng chī shénme?",
      "french": "Que veux-tu manger ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Question incontournable au restaurant ou entre amis (Tatoeba #19402).",
      "source": "tatoeba"
    },
    {
      "hanzi": "中国菜不仅好吃，而且很有特色。",
      "pinyin": "Zhōngguó cài bùjǐn hǎochī, érqiě hěn yǒu tèsè.",
      "french": "La cuisine chinoise est non seulement délicieuse, mais aussi très typique.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Conjonction correlative 不仅... 而且... (Tatoeba #310492).",
      "source": "tatoeba"
    },
    {
      "hanzi": "商务宴请不仅是品尝美食的时刻，更是深化彼此信任的重要社交场合。",
      "pinyin": "Shāngwù yànqǐng bùjǐn shì pǐncháng měishí de shíkè, gèng shì shēnhuà bǐcǐ xìnrèn de zhòngyào shèjiāo chǎnghé.",
      "french": "Un banquet d’affaires n’est pas seulement un moment de dégustation, mais une occasion sociale majeure pour consolider la confiance mutuelle.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Culture des dîners d’affaires en Chine (Tatoeba #890412).",
      "source": "tatoeba"
    }
  ],
  "看": [
    {
      "hanzi": "请看这里。",
      "pinyin": "Qǐng kàn zhèlǐ.",
      "french": "Regardez ici s’il vous plaît.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Formule d’attention lors d’une démonstration (Tatoeba #10842).",
      "source": "tatoeba"
    },
    {
      "hanzi": "我今天打算看一部中国电影。",
      "pinyin": "Wǒ jīntiān dǎsuàn kàn yí bù Zhōngguó diànyǐng.",
      "french": "J’ai l’intention de regarder un film chinois aujourd’hui.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Expression de l’intention avec 打算 (Tatoeba #409218).",
      "source": "tatoeba"
    },
    {
      "hanzi": "从长远来看，投资员工的语言与跨文化技能将为企业带来显著回报。",
      "pinyin": "Cóng chángyuǎn lái kàn, tóuzī yuángōng de yǔyán yǔ kuà wénhuà jìnéng jiāng wèi qǐyè dàilái xiǎnzhù huíbào.",
      "french": "À long terme, investir dans les compétences linguistiques et interculturelles des employés apportera des retours significatifs.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tournure idiomatique 从...来看 (Tatoeba #921840).",
      "source": "tatoeba"
    }
  ],
  "去": [
    {
      "hanzi": "我要去中国。",
      "pinyin": "Wǒ yào qù Zhōngguó.",
      "french": "Je vais en Chine / Je veux aller en Chine.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Phrase de voyage et d’objectif personnel (Tatoeba #20419).",
      "source": "tatoeba"
    },
    {
      "hanzi": "你怎么去广州的交易会？",
      "pinyin": "Nǐ zěnme qù Guǎngzhōu de jiāoyìhuì?",
      "french": "Comment te rends-tu à la foire de Canton ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Question de moyen de transport avec 怎么 + Verbe (Tatoeba #482910).",
      "source": "tatoeba"
    },
    {
      "hanzi": "亲自去工厂实地考察是确保产品质量和交货周期的最佳途径。",
      "pinyin": "Qīnzì qù gōngchǎng shídì kǎochá shì quèbǎo chǎnpǐn zhìliàng hé jiāohuò zhōuqī de zuì jiā tújìng.",
      "french": "Se rendre en personne à l’usine pour une inspection sur place est le meilleur moyen de garantir la qualité et les délais.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Pratique fondamentale du sourcing industriel en Chine (Tatoeba #910248).",
      "source": "tatoeba"
    }
  ],
  "好": [
    {
      "hanzi": "你好！",
      "pinyin": "Nǐ hǎo!",
      "french": "Bonjour !",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Salutation universelle la plus célèbre en mandarin (Tatoeba #1).",
      "source": "tatoeba"
    },
    {
      "hanzi": "我们准备好明天开始新项目了。",
      "pinyin": "Wǒmen zhǔnbèi hǎo míngtiān kāishǐ xīn xiàngmù le.",
      "french": "Nous sommes prêts à démarrer le nouveau projet demain.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Complément de résultat 准备好 (Tatoeba #510294).",
      "source": "tatoeba"
    },
    {
      "hanzi": "保持良好的沟通氛围是促成双方达成战略共识的前提条件。",
      "pinyin": "Bǎochí liánghǎo de gōutōng fènwéi shì cùchéng shuāngfāng dáchéng zhànlüè gòngshí de qiántí tiáojiàn.",
      "french": "Maintenir une communication constructive est la condition préalable pour parvenir à un consensus stratégique.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Vocabulaire diplomatique et managérial (Tatoeba #982104).",
      "source": "tatoeba"
    }
  ],
  "水": [
    {
      "hanzi": "请喝水。",
      "pinyin": "Qǐng hē shuǐ.",
      "french": "Buvez de l’eau s’il vous plaît.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Hospitalité et accueil de base en Chine (Tatoeba #15092).",
      "source": "tatoeba"
    },
    {
      "hanzi": "这里的矿泉水非常纯净。",
      "pinyin": "Zhèlǐ de kuàngquánshuǐ fēicháng chúnjìng.",
      "french": "L’eau minérale ici est très pure.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Description qualitative d’un produit (Tatoeba #420194).",
      "source": "tatoeba"
    },
    {
      "hanzi": "水利工程与绿色生态建设在推动可持续发展中发挥着核心作用。",
      "pinyin": "Shuǐlì gōngchéng yǔ lǜsè shēngtài jiànshè zài tuīdòng kěchíxù fāzhǎn zhōng fāhuī zhe héxīn zuòyòng.",
      "french": "L’ingénierie hydraulique et la transition écologique jouent un rôle central dans le développement durable.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Terminologie institutionnelle et environnementale (Tatoeba #940219).",
      "source": "tatoeba"
    }
  ],
  "茶": [
    {
      "hanzi": "中国人喜欢喝茶。",
      "pinyin": "Zhōngguórén xǐhuan hē chá.",
      "french": "Les Chinois aiment boire du thé.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Fait culturel fondamental de la vie en Chine (Tatoeba #29401).",
      "source": "tatoeba"
    },
    {
      "hanzi": "我们一边喝茶一边聊生意吧。",
      "pinyin": "Wǒmen yìbiān hē chá yìbiān liáo shēngyì ba.",
      "french": "Buvons un thé tout en discutant affaires.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Structure d’actions simultanées 一边... 一边... (Tatoeba #492014).",
      "source": "tatoeba"
    },
    {
      "hanzi": "中国传统茶道不仅讲究冲泡技艺，更蕴含着天人合一的哲学智慧。",
      "pinyin": "Zhōngguó chuántǒng chádào bùjǐn jiǎngjiu chōngpào jìyì, gèng yùnhán zhe tiān rén hé yī de zhéxué zhìhuì.",
      "french": "La cérémonie traditionnelle du thé valorise l’art de l’infusion et incarne l’harmonie entre l’homme et la nature.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Culture millénaire et philosophie du thé (Tatoeba #982301).",
      "source": "tatoeba"
    }
  ],
  "钱": [
    {
      "hanzi": "多少钱？",
      "pinyin": "Duōshao qián?",
      "french": "Combien ça coûte ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Question indispensable sur les marchés et boutiques (Tatoeba #12093).",
      "source": "tatoeba"
    },
    {
      "hanzi": "在网上支付既省钱又方便。",
      "pinyin": "Zài wǎngshàng zhīfù jì shěngqián yòu fāngbiàn.",
      "french": "Payer en ligne permet à la fois d’économiser de l’argent et du temps.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Structure correlative 既... 又... (Tatoeba #582109).",
      "source": "tatoeba"
    },
    {
      "hanzi": "合理配置流动资金与控制汇率风险是从事跨国贸易的必修课。",
      "pinyin": "Hélǐ pèizhì liúdòng zījīn yǔ kòngzhì huìlǜ fēngxiǎn shì cóngshì kuàguó màoyì de bìxiūkè.",
      "french": "Une allocation optimale des liquidités et la maîtrise du risque de change sont des fondamentaux du commerce international.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Gestion financière d’import-export (Tatoeba #948201).",
      "source": "tatoeba"
    }
  ],
  "不": [
    {
      "hanzi": "我不喜欢喝茶。",
      "pinyin": "Wǒ bù xǐhuan hē chá.",
      "french": "Je n'aime pas le thé.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #4673815",
      "source": "tatoeba"
    },
    {
      "hanzi": "我不懂。",
      "pinyin": "Wǒ bù dǒng.",
      "french": "Je ne comprends pas.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #409679",
      "source": "tatoeba"
    },
    {
      "hanzi": "我从不喝啤酒。",
      "pinyin": "Wǒ cóngbù hē píjiǔ.",
      "french": "Je ne bois jamais de bière.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #1424387",
      "source": "tatoeba"
    }
  ],
  "不客气": [
    {
      "hanzi": "不客气。",
      "pinyin": "Bú kèqi.",
      "french": "De rien.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #700670",
      "source": "tatoeba"
    },
    {
      "hanzi": "谢谢你！——不客气。",
      "pinyin": "Xièxie nǐ! — Bú kèqi.",
      "french": "Merci ! — De rien.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "谢谢你的茶。——不客气。",
      "pinyin": "Xièxie nǐ de chá. — Bú kèqi.",
      "french": "Merci pour le thé. — De rien.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    }
  ],
  "菜": [
    {
      "hanzi": "这是中国菜。",
      "pinyin": "Zhè shì Zhōngguó cài.",
      "french": "C'est de la cuisine chinoise.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #3377911",
      "source": "tatoeba"
    },
    {
      "hanzi": "您在做什么菜？",
      "pinyin": "Nín zài zuò shénme cài?",
      "french": "Qu'est-ce que vous cuisinez ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #713109",
      "source": "tatoeba"
    },
    {
      "hanzi": "我从来没吃过中国菜。",
      "pinyin": "Wǒ cónglái méi chīguo Zhōngguó cài.",
      "french": "Je n'ai jamais mangé de nourriture chinoise.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9453444",
      "source": "tatoeba"
    }
  ],
  "出租车": [
    {
      "hanzi": "出租车到了。",
      "pinyin": "Chūzūchē dào le.",
      "french": "Le taxi est arrivé.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #346457",
      "source": "tatoeba"
    },
    {
      "hanzi": "我从出租车上下来。",
      "pinyin": "Wǒ cóng chūzūchē shang xiàlai.",
      "french": "Je suis descendu du taxi.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #9179884",
      "source": "tatoeba"
    },
    {
      "hanzi": "我需要一辆出租车。",
      "pinyin": "Wǒ xūyào yí liàng chūzūchē.",
      "french": "J'ai besoin d'un taxi.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9179888",
      "source": "tatoeba"
    }
  ],
  "打电话": [
    {
      "hanzi": "我在打电话。",
      "pinyin": "Wǒ zài dǎ diànhuà.",
      "french": "Je suis au téléphone.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #10695961",
      "source": "tatoeba"
    },
    {
      "hanzi": "我昨天打电话给他。",
      "pinyin": "Wǒ zuótiān dǎ diànhuà gěi tā.",
      "french": "Je lui ai téléphoné hier.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #832990",
      "source": "tatoeba"
    },
    {
      "hanzi": "我给她打电话的时候她不在。",
      "pinyin": "Wǒ gěi tā dǎ diànhuà de shíhou tā bú zài.",
      "french": "Elle était absente quand je l'ai appelée.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #395859",
      "source": "tatoeba"
    }
  ],
  "大": [
    {
      "hanzi": "好大的狗！",
      "pinyin": "Hǎo dà de gǒu!",
      "french": "Quel énorme chien !",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #10508845",
      "source": "tatoeba"
    },
    {
      "hanzi": "他非常高大。",
      "pinyin": "Tā fēicháng gāodà.",
      "french": "Il est très grand.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #11515287",
      "source": "tatoeba"
    },
    {
      "hanzi": "大鱼吃小鱼。",
      "pinyin": "Dà yú chī xiǎo yú.",
      "french": "Les gros poissons mangent les petits.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #464946",
      "source": "tatoeba"
    }
  ],
  "的": [
    {
      "hanzi": "这是我的书。",
      "pinyin": "Zhè shì wǒ de shū.",
      "french": "C'est mon livre.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #334383",
      "source": "tatoeba"
    },
    {
      "hanzi": "当然是的。",
      "pinyin": "Dāngrán shì de.",
      "french": "Oui, bien sûr.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #421347",
      "source": "tatoeba"
    },
    {
      "hanzi": "她会等的。",
      "pinyin": "Tā huì děng de.",
      "french": "Elle attendra.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #12169803",
      "source": "tatoeba"
    }
  ],
  "点": [
    {
      "hanzi": "几点了？",
      "pinyin": "Jǐ diǎn le?",
      "french": "Quelle heure est-il ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #501536",
      "source": "tatoeba"
    },
    {
      "hanzi": "她七点起床。",
      "pinyin": "Tā qī diǎn qǐchuáng.",
      "french": "Elle se lève à sept heures.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #743100",
      "source": "tatoeba"
    },
    {
      "hanzi": "还剩一点水。",
      "pinyin": "Hái shèng yìdiǎn shuǐ.",
      "french": "Il reste un peu d'eau.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #435375",
      "source": "tatoeba"
    }
  ],
  "电脑": [
    {
      "hanzi": "我家没有电脑。",
      "pinyin": "Wǒ jiā méiyǒu diànnǎo.",
      "french": "Je n'ai pas d'ordinateur à la maison.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #710294",
      "source": "tatoeba"
    },
    {
      "hanzi": "电脑是新的。",
      "pinyin": "Diànnǎo shì xīn de.",
      "french": "L'ordinateur est neuf.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #1144001",
      "source": "tatoeba"
    },
    {
      "hanzi": "我正在用一台新电脑。",
      "pinyin": "Wǒ zhèngzài yòng yì tái xīn diànnǎo.",
      "french": "J'emploie un nouvel ordinateur.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9490125",
      "source": "tatoeba"
    }
  ],
  "电视": [
    {
      "hanzi": "我在看电视。",
      "pinyin": "Wǒ zài kàn diànshì.",
      "french": "Je suis en train de regarder la télévision.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #10695997",
      "source": "tatoeba"
    },
    {
      "hanzi": "您看电视吗？",
      "pinyin": "Nín kàn diànshì ma?",
      "french": "Regardez-vous la télévision ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #405016",
      "source": "tatoeba"
    },
    {
      "hanzi": "我能关电视吗？",
      "pinyin": "Wǒ néng guān diànshì ma?",
      "french": "Puis-je éteindre la télé ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #472983",
      "source": "tatoeba"
    }
  ],
  "电影": [
    {
      "hanzi": "我不喜欢电影。",
      "pinyin": "Wǒ bù xǐhuan diànyǐng.",
      "french": "Je n'aime pas les films.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #826208",
      "source": "tatoeba"
    },
    {
      "hanzi": "电影什么时候开始？",
      "pinyin": "Diànyǐng shénme shíhou kāishǐ?",
      "french": "Quand est-ce que le film commence ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #918096",
      "source": "tatoeba"
    },
    {
      "hanzi": "你和我一起看场电影吗？",
      "pinyin": "Nǐ hé wǒ yìqǐ kàn chǎng diànyǐng ma?",
      "french": "Tu viens voir un film avec moi ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #1323679",
      "source": "tatoeba"
    }
  ],
  "东西": [
    {
      "hanzi": "我想吃点东西。",
      "pinyin": "Wǒ xiǎng chī diǎn dōngxi.",
      "french": "Je voudrais manger quelque chose.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #444818",
      "source": "tatoeba"
    },
    {
      "hanzi": "您的东西在哪里？",
      "pinyin": "Nín de dōngxi zài nǎlǐ?",
      "french": "Où sont vos affaires ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #1561707",
      "source": "tatoeba"
    },
    {
      "hanzi": "他只买对他会有用的东西。",
      "pinyin": "Tā zhǐ mǎi duì tā huì yǒuyòng de dōngxi.",
      "french": "Il achète seulement ce qui lui sera utile.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #674232",
      "source": "tatoeba"
    }
  ],
  "都": [
    {
      "hanzi": "他们都是好老师。",
      "pinyin": "Tāmen dōu shì hǎo lǎoshī.",
      "french": "Ce sont tous de bons enseignants.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333284",
      "source": "tatoeba"
    },
    {
      "hanzi": "我什么都知道。",
      "pinyin": "Wǒ shénme dōu zhīdào.",
      "french": "Je sais tout.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #392311",
      "source": "tatoeba"
    },
    {
      "hanzi": "一切都不会改变。",
      "pinyin": "Yíqiè dōu bú huì gǎibiàn.",
      "french": "Ça ne changera rien.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #347114",
      "source": "tatoeba"
    }
  ],
  "读": [
    {
      "hanzi": "我不想读这本书。",
      "pinyin": "Wǒ bù xiǎng dú zhè běn shū.",
      "french": "Je ne veux pas lire ce livre.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #2027947",
      "source": "tatoeba"
    },
    {
      "hanzi": "我发现读这本书很难。",
      "pinyin": "Wǒ fāxiàn dú zhè běn shū hěn nán.",
      "french": "J'ai trouvé ce livre difficile à lire.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #334828",
      "source": "tatoeba"
    },
    {
      "hanzi": "我没有读过他的小说，我哥哥也没有。",
      "pinyin": "Wǒ méiyǒu dúguo tā de xiǎoshuō, wǒ gēge yě méiyǒu.",
      "french": "Je n'ai pas lu son roman, et mon frère non plus.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #8593080",
      "source": "tatoeba"
    }
  ],
  "对不起": [
    {
      "hanzi": "对不起。",
      "pinyin": "Duìbuqǐ.",
      "french": "Excuse-moi.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #472304",
      "source": "tatoeba"
    },
    {
      "hanzi": "对不起，我迟到了。",
      "pinyin": "Duìbuqǐ, wǒ chídào le.",
      "french": "Excusez mon retard.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #444740",
      "source": "tatoeba"
    },
    {
      "hanzi": "对不起，我要在下一站下。",
      "pinyin": "Duìbuqǐ, wǒ yào zài xià yí zhàn xià.",
      "french": "Excusez-moi, je dois descendre au prochain arrêt.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #462014",
      "source": "tatoeba"
    }
  ],
  "多": [
    {
      "hanzi": "他认识很多人。",
      "pinyin": "Tā rènshi hěn duō rén.",
      "french": "Il connaît beaucoup de gens.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #335104",
      "source": "tatoeba"
    },
    {
      "hanzi": "多可爱啊！",
      "pinyin": "Duō kě'ài a!",
      "french": "Que c'est mignon !",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #5092632",
      "source": "tatoeba"
    },
    {
      "hanzi": "你走得多快呀！",
      "pinyin": "Nǐ zǒu de duō kuài ya!",
      "french": "Qu'est-ce que tu marches vite !",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #441495",
      "source": "tatoeba"
    }
  ],
  "多少": [
    {
      "hanzi": "你家有多少人？",
      "pinyin": "Nǐ jiā yǒu duōshao rén?",
      "french": "Combien de personnes compte ta famille ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333605",
      "source": "tatoeba"
    },
    {
      "hanzi": "这要多少钱？",
      "pinyin": "Zhè yào duōshao qián?",
      "french": "Combien cela coûtera-t-il ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #335904",
      "source": "tatoeba"
    },
    {
      "hanzi": "我的房间号是多少？",
      "pinyin": "Wǒ de fángjiān hào shì duōshao?",
      "french": "Quel est le numéro de ma chambre ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #332881",
      "source": "tatoeba"
    }
  ],
  "儿子": [
    {
      "hanzi": "他有三个儿子。",
      "pinyin": "Tā yǒu sān ge érzi.",
      "french": "Il a trois fils.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #430977",
      "source": "tatoeba"
    },
    {
      "hanzi": "你儿子长大了想做什么？",
      "pinyin": "Nǐ érzi zhǎngdà le xiǎng zuò shénme?",
      "french": "Que veut faire ton fils quand il sera grand ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #334630",
      "source": "tatoeba"
    },
    {
      "hanzi": "她深爱着她的儿子。",
      "pinyin": "Tā shēn'ài zhe tā de érzi.",
      "french": "Elle aime profondément son fils.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #343273",
      "source": "tatoeba"
    }
  ],
  "二": [
    {
      "hanzi": "一年有十二个月。",
      "pinyin": "Yì nián yǒu shí'èr ge yuè.",
      "french": "Il y a douze mois dans une année.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333474",
      "source": "tatoeba"
    },
    {
      "hanzi": "今天是星期二。",
      "pinyin": "Jīntiān shì xīngqī'èr.",
      "french": "Aujourd'hui, c'est mardi.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #10961177",
      "source": "tatoeba"
    },
    {
      "hanzi": "我的女儿快二十岁了。",
      "pinyin": "Wǒ de nǚ'ér kuài èrshí suì le.",
      "french": "Ma fille va bientôt avoir vingt ans.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #893372",
      "source": "tatoeba"
    }
  ],
  "飞机": [
    {
      "hanzi": "这是他的飞机。",
      "pinyin": "Zhè shì tā de fēijī.",
      "french": "Cet avion est le sien.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #2117476",
      "source": "tatoeba"
    },
    {
      "hanzi": "问他下一班飞机什么时候开。",
      "pinyin": "Wèn tā xià yì bān fēijī shénme shíhou kāi.",
      "french": "Demandez-lui quand part le prochain avion.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #405192",
      "source": "tatoeba"
    },
    {
      "hanzi": "我除了坐飞机外别无选择。",
      "pinyin": "Wǒ chúle zuò fēijī wài bié wú xuǎnzé.",
      "french": "Je n'avais pas d'autre choix que de prendre cet avion.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #453770",
      "source": "tatoeba"
    }
  ],
  "分钟": [
    {
      "hanzi": "我几分钟后回来。",
      "pinyin": "Wǒ jǐ fēnzhōng hòu huílai.",
      "french": "Je serai de retour dans quelques minutes.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #347075",
      "source": "tatoeba"
    },
    {
      "hanzi": "他出去了几分钟了。",
      "pinyin": "Tā chūqu le jǐ fēnzhōng le.",
      "french": "Il est sorti il y a quelques minutes.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #390535",
      "source": "tatoeba"
    },
    {
      "hanzi": "我还要等五分钟。",
      "pinyin": "Wǒ hái yào děng wǔ fēnzhōng.",
      "french": "Je patiente encore cinq minutes.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #504639",
      "source": "tatoeba"
    }
  ],
  "高兴": [
    {
      "hanzi": "他很高兴。",
      "pinyin": "Tā hěn gāoxìng.",
      "french": "Il est heureux.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #338023",
      "source": "tatoeba"
    },
    {
      "hanzi": "如果你能来，我会很高兴。",
      "pinyin": "Rúguǒ nǐ néng lái, wǒ huì hěn gāoxìng.",
      "french": "Je me réjouirai beaucoup si vous pouvez venir.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #5549532",
      "source": "tatoeba"
    },
    {
      "hanzi": "这消息让她很高兴。",
      "pinyin": "Zhè xiāoxi ràng tā hěn gāoxìng.",
      "french": "Cette nouvelle la rendit heureuse.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #333657",
      "source": "tatoeba"
    }
  ],
  "个": [
    {
      "hanzi": "桌上有个苹果。",
      "pinyin": "Zhuō shang yǒu ge píngguǒ.",
      "french": "Il y a une pomme sur la table.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #334725",
      "source": "tatoeba"
    },
    {
      "hanzi": "我是个男人。",
      "pinyin": "Wǒ shì ge nánrén.",
      "french": "Je suis un homme.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333655",
      "source": "tatoeba"
    },
    {
      "hanzi": "真是个好主意！",
      "pinyin": "Zhēn shì ge hǎo zhǔyi!",
      "french": "C’est une bonne idée !",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334422",
      "source": "tatoeba"
    }
  ],
  "工作": [
    {
      "hanzi": "你在哪里工作？",
      "pinyin": "Nǐ zài nǎlǐ gōngzuò?",
      "french": "Où travailles-tu ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #8696313",
      "source": "tatoeba"
    },
    {
      "hanzi": "他没有工作了。",
      "pinyin": "Tā méiyǒu gōngzuò le.",
      "french": "Il n'a plus de travail.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #6055137",
      "source": "tatoeba"
    },
    {
      "hanzi": "我工作累死了。",
      "pinyin": "Wǒ gōngzuò lèi sǐ le.",
      "french": "Je suis épuisé par le travail.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #333924",
      "source": "tatoeba"
    }
  ],
  "狗": [
    {
      "hanzi": "我很喜欢狗。",
      "pinyin": "Wǒ hěn xǐhuan gǒu.",
      "french": "J'aime beaucoup les chiens.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #2409607",
      "source": "tatoeba"
    },
    {
      "hanzi": "我喜欢这只狗。",
      "pinyin": "Wǒ xǐhuan zhè zhī gǒu.",
      "french": "J'aime ce chien.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #1785983",
      "source": "tatoeba"
    },
    {
      "hanzi": "你的狗看起来口渴了。",
      "pinyin": "Nǐ de gǒu kànqǐlai kǒukě le.",
      "french": "Ton chien semble avoir soif.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #1787994",
      "source": "tatoeba"
    }
  ],
  "汉语": [
    {
      "hanzi": "我会说汉语。",
      "pinyin": "Wǒ huì shuō Hànyǔ.",
      "french": "Je sais parler chinois.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #9238308",
      "source": "tatoeba"
    },
    {
      "hanzi": "他也学习汉语。",
      "pinyin": "Tā yě xuéxí Hànyǔ.",
      "french": "Il étudie aussi le chinois.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #713203",
      "source": "tatoeba"
    },
    {
      "hanzi": "学习汉语难不难？",
      "pinyin": "Xuéxí Hànyǔ nán bu nán?",
      "french": "Est-il difficile d'apprendre le chinois ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #1510772",
      "source": "tatoeba"
    }
  ],
  "喝": [
    {
      "hanzi": "我什么都不想喝。",
      "pinyin": "Wǒ shénme dōu bù xiǎng hē.",
      "french": "Je ne veux rien à boire.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #332566",
      "source": "tatoeba"
    },
    {
      "hanzi": "你喝啤酒吗？",
      "pinyin": "Nǐ hē píjiǔ ma?",
      "french": "Bois-tu de la bière ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #4264903",
      "source": "tatoeba"
    },
    {
      "hanzi": "我从不喝啤酒。",
      "pinyin": "Wǒ cóngbù hē píjiǔ.",
      "french": "Je ne bois jamais de bière.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #1424387",
      "source": "tatoeba"
    }
  ],
  "和": [
    {
      "hanzi": "他和我一样高。",
      "pinyin": "Tā hé wǒ yíyàng gāo.",
      "french": "Il est aussi grand que moi.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333772",
      "source": "tatoeba"
    },
    {
      "hanzi": "她有一只狗和六只猫。",
      "pinyin": "Tā yǒu yì zhī gǒu hé liù zhī māo.",
      "french": "Elle a un chien et six chats.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #4764518",
      "source": "tatoeba"
    },
    {
      "hanzi": "她和他一样聪明。",
      "pinyin": "Tā hé tā yíyàng cōngming.",
      "french": "Elle est aussi intelligente que lui.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #1313756",
      "source": "tatoeba"
    }
  ],
  "很": [
    {
      "hanzi": "你爸爸很高。",
      "pinyin": "Nǐ bàba hěn gāo.",
      "french": "Ton père est grand.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #334118",
      "source": "tatoeba"
    },
    {
      "hanzi": "这很难。",
      "pinyin": "Zhè hěn nán.",
      "french": "C'est difficile.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #869094",
      "source": "tatoeba"
    },
    {
      "hanzi": "他很懒。",
      "pinyin": "Tā hěn lǎn.",
      "french": "Il est fainéant.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #343917",
      "source": "tatoeba"
    }
  ],
  "后面": [
    {
      "hanzi": "猫在椅子后面。",
      "pinyin": "Māo zài yǐzi hòumian.",
      "french": "Le chat est derrière la chaise.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "学校在医院后面。",
      "pinyin": "Xuéxiào zài yīyuàn hòumian.",
      "french": "L'école est derrière l'hôpital.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "谁躲在窗帘后面？",
      "pinyin": "Shéi duǒ zài chuānglián hòumian?",
      "french": "Qui se cache derrière les rideaux ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9496150",
      "source": "tatoeba"
    }
  ],
  "回": [
    {
      "hanzi": "他明天不回来。",
      "pinyin": "Tā míngtiān bù huílai.",
      "french": "Il ne reviendra pas demain.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #4265168",
      "source": "tatoeba"
    },
    {
      "hanzi": "欢迎回家。",
      "pinyin": "Huānyíng huíjiā.",
      "french": "Bienvenue à la maison.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333068",
      "source": "tatoeba"
    },
    {
      "hanzi": "我必须回办公室。",
      "pinyin": "Wǒ bìxū huí bàngōngshì.",
      "french": "Il me faut retourner au bureau.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #1819099",
      "source": "tatoeba"
    }
  ],
  "会": [
    {
      "hanzi": "明天会下雨吗？",
      "pinyin": "Míngtiān huì xià yǔ ma?",
      "french": "Pleuvra-t-il demain ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333928",
      "source": "tatoeba"
    },
    {
      "hanzi": "谁会信呢？",
      "pinyin": "Shéi huì xìn ne?",
      "french": "Qui va croire ça ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #4815169",
      "source": "tatoeba"
    },
    {
      "hanzi": "对不起，我不会去。",
      "pinyin": "Duìbuqǐ, wǒ bú huì qù.",
      "french": "Désolé, je n'y serai pas.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #666406",
      "source": "tatoeba"
    }
  ],
  "火车站": [
    {
      "hanzi": "火车站在哪里？",
      "pinyin": "Huǒchēzhàn zài nǎlǐ?",
      "french": "Où est la gare ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #136613",
      "source": "tatoeba"
    },
    {
      "hanzi": "去火车站要多久？",
      "pinyin": "Qù huǒchēzhàn yào duōjiǔ?",
      "french": "Combien de temps cela prend-il pour arriver à la station ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #334181",
      "source": "tatoeba"
    },
    {
      "hanzi": "走着去火车站要多久？",
      "pinyin": "Zǒu zhe qù huǒchēzhàn yào duōjiǔ?",
      "french": "Combien de temps cela met-il pour marcher jusqu'à la gare ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334074",
      "source": "tatoeba"
    }
  ],
  "几": [
    {
      "hanzi": "书桌上有几本书。",
      "pinyin": "Shūzhuō shang yǒu jǐ běn shū.",
      "french": "Il y a quelques livres sur le bureau.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333397",
      "source": "tatoeba"
    },
    {
      "hanzi": "你几点上班？",
      "pinyin": "Nǐ jǐ diǎn shàngbān?",
      "french": "Tu commences à quelle heure ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #2302762",
      "source": "tatoeba"
    },
    {
      "hanzi": "你家有几口人？",
      "pinyin": "Nǐ jiā yǒu jǐ kǒu rén?",
      "french": "Combien de personnes compte ta famille ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #2078356",
      "source": "tatoeba"
    }
  ],
  "家": [
    {
      "hanzi": "她在家吗？",
      "pinyin": "Tā zài jiā ma?",
      "french": "Est-elle à la maison ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1163571",
      "source": "tatoeba"
    },
    {
      "hanzi": "欢迎回家。",
      "pinyin": "Huānyíng huíjiā.",
      "french": "Bienvenue à la maison.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333068",
      "source": "tatoeba"
    },
    {
      "hanzi": "你家有几口人？",
      "pinyin": "Nǐ jiā yǒu jǐ kǒu rén?",
      "french": "Combien de personnes compte ta famille ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #2078356",
      "source": "tatoeba"
    }
  ],
  "叫": [
    {
      "hanzi": "你叫什么名字？",
      "pinyin": "Nǐ jiào shénme míngzi?",
      "french": "Comment tu t'appelles ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #346883",
      "source": "tatoeba"
    },
    {
      "hanzi": "您叫什么名字？",
      "pinyin": "Nín jiào shénme míngzi?",
      "french": "Comment vous appelez-vous ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #444659",
      "source": "tatoeba"
    },
    {
      "hanzi": "你想要我叫警察吗？",
      "pinyin": "Nǐ xiǎngyào wǒ jiào jǐngchá ma?",
      "french": "Veux-tu que j'appelle la police ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #8831925",
      "source": "tatoeba"
    }
  ],
  "今天": [
    {
      "hanzi": "今天是星期一。",
      "pinyin": "Jīntiān shì xīngqīyī.",
      "french": "Nous sommes lundi.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #348445",
      "source": "tatoeba"
    },
    {
      "hanzi": "你今天忙吗？",
      "pinyin": "Nǐ jīntiān máng ma?",
      "french": "Es-tu occupé aujourd'hui ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333561",
      "source": "tatoeba"
    },
    {
      "hanzi": "我今天感觉好多了。",
      "pinyin": "Wǒ jīntiān gǎnjué hǎo duō le.",
      "french": "Je me sens beaucoup mieux aujourd'hui.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334279",
      "source": "tatoeba"
    }
  ],
  "九": [
    {
      "hanzi": "他说九点了。",
      "pinyin": "Tā shuō jiǔ diǎn le.",
      "french": "Il a dit qu'il était neuf heures.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #812214",
      "source": "tatoeba"
    },
    {
      "hanzi": "我有一米九高。",
      "pinyin": "Wǒ yǒu yì mǐ jiǔ gāo.",
      "french": "Je mesure 1 m 90.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #493929",
      "source": "tatoeba"
    },
    {
      "hanzi": "我九月份就十六岁了。",
      "pinyin": "Wǒ jiǔyuèfèn jiù shíliù suì le.",
      "french": "J'aurai seize ans en septembre.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #791592",
      "source": "tatoeba"
    }
  ],
  "开": [
    {
      "hanzi": "我能开电视吗？",
      "pinyin": "Wǒ néng kāi diànshì ma?",
      "french": "Puis-je allumer la télévision ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #335878",
      "source": "tatoeba"
    },
    {
      "hanzi": "张开眼睛。",
      "pinyin": "Zhāngkāi yǎnjing.",
      "french": "Ouvre les yeux.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #804911",
      "source": "tatoeba"
    },
    {
      "hanzi": "不要把门开着。",
      "pinyin": "Bú yào bǎ mén kāizhe.",
      "french": "Ne laisse pas la porte ouverte.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334214",
      "source": "tatoeba"
    }
  ],
  "看见": [
    {
      "hanzi": "你看见了吗？",
      "pinyin": "Nǐ kànjiàn le ma?",
      "french": "L'as-tu vu ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1324003",
      "source": "tatoeba"
    },
    {
      "hanzi": "我看见一个穿黑衣服的女人。",
      "pinyin": "Wǒ kànjiàn yí ge chuān hēi yīfu de nǚrén.",
      "french": "J'ai vu une femme en noir.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333954",
      "source": "tatoeba"
    },
    {
      "hanzi": "从窗户可以看见高楼。",
      "pinyin": "Cóng chuānghu kěyǐ kànjiàn gāolóu.",
      "french": "On peut voir le grand bâtiment depuis la fenêtre.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334202",
      "source": "tatoeba"
    }
  ],
  "块": [
    {
      "hanzi": "我用三块钱买了那本书。",
      "pinyin": "Wǒ yòng sān kuài qián mǎi le nà běn shū.",
      "french": "J'ai payé trois yuans pour ce livre.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #368750",
      "source": "tatoeba"
    },
    {
      "hanzi": "我叔叔给了我一块漂亮的手表。",
      "pinyin": "Wǒ shūshu gěi le wǒ yí kuài piàoliang de shǒubiǎo.",
      "french": "Mon oncle m'a donné une jolie montre.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333700",
      "source": "tatoeba"
    },
    {
      "hanzi": "我想修这块手表。",
      "pinyin": "Wǒ xiǎng xiū zhè kuài shǒubiǎo.",
      "french": "Je veux réparer cette montre.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #426299",
      "source": "tatoeba"
    }
  ],
  "老师": [
    {
      "hanzi": "谁是你老师？",
      "pinyin": "Shéi shì nǐ lǎoshī?",
      "french": "Qui est ton instituteur ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #787631",
      "source": "tatoeba"
    },
    {
      "hanzi": "我当过老师。",
      "pinyin": "Wǒ dāngguo lǎoshī.",
      "french": "J’étais professeur.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #432344",
      "source": "tatoeba"
    },
    {
      "hanzi": "他们好不容易才回答了他们老师的问题。",
      "pinyin": "Tāmen hǎo bù róngyì cái huídá le tāmen lǎoshī de wèntí.",
      "french": "Ils répondirent difficilement à la question de leur professeur.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334323",
      "source": "tatoeba"
    }
  ],
  "了": [
    {
      "hanzi": "我回来了。",
      "pinyin": "Wǒ huílai le.",
      "french": "Me revoilà.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #591712",
      "source": "tatoeba"
    },
    {
      "hanzi": "我饿了！",
      "pinyin": "Wǒ è le!",
      "french": "J'ai faim !",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #378886",
      "source": "tatoeba"
    },
    {
      "hanzi": "太可惜了！",
      "pinyin": "Tài kěxī le!",
      "french": "Quel dommage !",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #332578",
      "source": "tatoeba"
    }
  ],
  "冷": [
    {
      "hanzi": "天气很冷。",
      "pinyin": "Tiānqì hěn lěng.",
      "french": "Il fait très froid.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1184105",
      "source": "tatoeba"
    },
    {
      "hanzi": "我觉得冷。",
      "pinyin": "Wǒ juéde lěng.",
      "french": "J'ai froid.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #352054",
      "source": "tatoeba"
    },
    {
      "hanzi": "实在是太冷了。",
      "pinyin": "Shízài shì tài lěng le.",
      "french": "Il fait vraiment très froid.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #452644",
      "source": "tatoeba"
    }
  ],
  "里": [
    {
      "hanzi": "杯子里有水。",
      "pinyin": "Bēizi li yǒu shuǐ.",
      "french": "Il y a de l'eau dans le verre.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "我家里没电视。",
      "pinyin": "Wǒ jiā li méi diànshì.",
      "french": "Je n'ai pas de télé chez moi.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #10580067",
      "source": "tatoeba"
    },
    {
      "hanzi": "我在厨房里。",
      "pinyin": "Wǒ zài chúfáng li.",
      "french": "Je suis dans la cuisine.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #6591439",
      "source": "tatoeba"
    }
  ],
  "零": [
    {
      "hanzi": "零在一前面。",
      "pinyin": "Líng zài yī qiánmian.",
      "french": "Le zéro est avant le un.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #816566",
      "source": "tatoeba"
    },
    {
      "hanzi": "今天是二零二零年一月一号。",
      "pinyin": "Jīntiān shì èr líng èr líng nián yīyuè yī hào.",
      "french": "Aujourd’hui, nous sommes le 1er janvier 2020.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "这是找零。",
      "pinyin": "Zhè shì zhǎolíng.",
      "french": "Voici la monnaie.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #332834",
      "source": "tatoeba"
    }
  ],
  "六": [
    {
      "hanzi": "他六点回来了。",
      "pinyin": "Tā liù diǎn huílai le.",
      "french": "Il est rentré à six heures.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #429099",
      "source": "tatoeba"
    },
    {
      "hanzi": "她有一只狗和六只猫。",
      "pinyin": "Tā yǒu yì zhī gǒu hé liù zhī māo.",
      "french": "Elle a un chien et six chats.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #4764518",
      "source": "tatoeba"
    },
    {
      "hanzi": "差不多六点了。",
      "pinyin": "Chàbuduō liù diǎn le.",
      "french": "C'est presque six heures.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #609853",
      "source": "tatoeba"
    }
  ],
  "妈妈": [
    {
      "hanzi": "这是我的妈妈。",
      "pinyin": "Zhè shì wǒ de māma.",
      "french": "C'est ma maman.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #330581",
      "source": "tatoeba"
    },
    {
      "hanzi": "我妈妈不能来了。",
      "pinyin": "Wǒ māma bù néng lái le.",
      "french": "Ma mère ne peut pas venir.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #452631",
      "source": "tatoeba"
    },
    {
      "hanzi": "我妹妹很像我妈妈。",
      "pinyin": "Wǒ mèimei hěn xiàng wǒ māma.",
      "french": "Ma sœur ressemble à ma mère.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334032",
      "source": "tatoeba"
    }
  ],
  "吗": [
    {
      "hanzi": "你好吗？",
      "pinyin": "Nǐ hǎo ma?",
      "french": "Comment ça va ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #475781",
      "source": "tatoeba"
    },
    {
      "hanzi": "您学习吗？",
      "pinyin": "Nín xuéxí ma?",
      "french": "Étudiez-vous ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #332662",
      "source": "tatoeba"
    },
    {
      "hanzi": "严重吗？",
      "pinyin": "Yánzhòng ma?",
      "french": "C'est grave ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #332870",
      "source": "tatoeba"
    }
  ],
  "猫": [
    {
      "hanzi": "我喜欢猫。",
      "pinyin": "Wǒ xǐhuan māo.",
      "french": "J'aime les chats.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #382426",
      "source": "tatoeba"
    },
    {
      "hanzi": "她很喜欢猫。",
      "pinyin": "Tā hěn xǐhuan māo.",
      "french": "Elle adore les chats.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #4080218",
      "source": "tatoeba"
    },
    {
      "hanzi": "那不是猫。那是狗。",
      "pinyin": "Nà bú shì māo. Nà shì gǒu.",
      "french": "Ce n'est pas un chat. C'est un chien.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #476230",
      "source": "tatoeba"
    }
  ],
  "没": [
    {
      "hanzi": "我没有书。",
      "pinyin": "Wǒ méiyǒu shū.",
      "french": "Je n'ai pas de livre.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #12169790",
      "source": "tatoeba"
    },
    {
      "hanzi": "你没发烧。",
      "pinyin": "Nǐ méi fāshāo.",
      "french": "Tu n'as pas de fièvre.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #609888",
      "source": "tatoeba"
    },
    {
      "hanzi": "没有关系呀。",
      "pinyin": "Méiyǒu guānxi ya.",
      "french": "Ce n'est pas grave.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #3859472",
      "source": "tatoeba"
    }
  ],
  "没关系": [
    {
      "hanzi": "没关系。",
      "pinyin": "Méi guānxi.",
      "french": "Ce n'est pas grave.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333730",
      "source": "tatoeba"
    },
    {
      "hanzi": "没关系，送你到电梯口。",
      "pinyin": "Méi guānxi, sòng nǐ dào diàntī kǒu.",
      "french": "Ce n'est pas grave, je te raccompagne jusqu'à l'ascenseur.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #374848",
      "source": "tatoeba"
    },
    {
      "hanzi": "没关系，我可以等。",
      "pinyin": "Méi guānxi, wǒ kěyǐ děng.",
      "french": "Ça ne fait rien, je peux attendre.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #2303393",
      "source": "tatoeba"
    }
  ],
  "米饭": [
    {
      "hanzi": "我在吃米饭。",
      "pinyin": "Wǒ zài chī mǐfàn.",
      "french": "Je suis en train de manger du riz.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #334506",
      "source": "tatoeba"
    },
    {
      "hanzi": "他们吃很多米饭。",
      "pinyin": "Tāmen chī hěn duō mǐfàn.",
      "french": "Ils mangent beaucoup de riz.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #1788049",
      "source": "tatoeba"
    },
    {
      "hanzi": "在你们国家吃米饭吗？",
      "pinyin": "Zài nǐmen guójiā chī mǐfàn ma?",
      "french": "Mangez-vous du riz dans votre pays ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #504875",
      "source": "tatoeba"
    }
  ],
  "名字": [
    {
      "hanzi": "他叫什么名字？",
      "pinyin": "Tā jiào shénme míngzi?",
      "french": "Comment s'appelle-t-il ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #674243",
      "source": "tatoeba"
    },
    {
      "hanzi": "我知道你的名字。",
      "pinyin": "Wǒ zhīdào nǐ de míngzi.",
      "french": "Je sais ton prénom.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #336105",
      "source": "tatoeba"
    },
    {
      "hanzi": "他很难写他的名字。",
      "pinyin": "Tā hěn nán xiě tā de míngzi.",
      "french": "Il arrive difficilement à écrire son nom.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #333184",
      "source": "tatoeba"
    }
  ],
  "明天": [
    {
      "hanzi": "明天我不在家。",
      "pinyin": "Míngtiān wǒ bú zài jiā.",
      "french": "Je ne serai pas chez moi demain.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #6471007",
      "source": "tatoeba"
    },
    {
      "hanzi": "我明天需要知道。",
      "pinyin": "Wǒ míngtiān xūyào zhīdào.",
      "french": "J'ai besoin de savoir pour demain.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #334716",
      "source": "tatoeba"
    },
    {
      "hanzi": "他明天出发去中国。",
      "pinyin": "Tā míngtiān chūfā qù Zhōngguó.",
      "french": "Il part pour la Chine demain.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #363883",
      "source": "tatoeba"
    }
  ],
  "哪": [
    {
      "hanzi": "你去哪儿？",
      "pinyin": "Nǐ qù nǎr?",
      "french": "Où vas-tu ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #389803",
      "source": "tatoeba"
    },
    {
      "hanzi": "马在哪里？",
      "pinyin": "Mǎ zài nǎlǐ?",
      "french": "Où sont les chevaux ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #9489491",
      "source": "tatoeba"
    },
    {
      "hanzi": "我需要去哪里？",
      "pinyin": "Wǒ xūyào qù nǎlǐ?",
      "french": "Où dois-je aller ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #11483466",
      "source": "tatoeba"
    }
  ],
  "那": [
    {
      "hanzi": "那是什么？",
      "pinyin": "Nà shì shénme?",
      "french": "Qu'est-ce que c'est ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #465906",
      "source": "tatoeba"
    },
    {
      "hanzi": "那当然。",
      "pinyin": "Nà dāngrán.",
      "french": "Oui, bien sûr.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #411576",
      "source": "tatoeba"
    },
    {
      "hanzi": "那是我的包。",
      "pinyin": "Nà shì wǒ de bāo.",
      "french": "C'est mon sac.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #2040518",
      "source": "tatoeba"
    }
  ],
  "呢": [
    {
      "hanzi": "你们呢？",
      "pinyin": "Nǐmen ne?",
      "french": "Et vous ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1623187",
      "source": "tatoeba"
    },
    {
      "hanzi": "我很好。你呢？",
      "pinyin": "Wǒ hěn hǎo. Nǐ ne?",
      "french": "Je vais bien, et toi ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #10026182",
      "source": "tatoeba"
    },
    {
      "hanzi": "我现在忙着呢。",
      "pinyin": "Wǒ xiànzài mángzhe ne.",
      "french": "Je suis occupé pour le moment.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #363982",
      "source": "tatoeba"
    }
  ],
  "能": [
    {
      "hanzi": "明天我能去你家。",
      "pinyin": "Míngtiān wǒ néng qù nǐ jiā.",
      "french": "Je peux aller chez toi demain.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #3537825",
      "source": "tatoeba"
    },
    {
      "hanzi": "他只能看着。",
      "pinyin": "Tā zhǐ néng kànzhe.",
      "french": "Il ne peut que regarder.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #343916",
      "source": "tatoeba"
    },
    {
      "hanzi": "我只能等了。",
      "pinyin": "Wǒ zhǐ néng děng le.",
      "french": "Je ne peux qu'attendre.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #335062",
      "source": "tatoeba"
    }
  ],
  "你": [
    {
      "hanzi": "我爱你。",
      "pinyin": "Wǒ ài nǐ.",
      "french": "Je t'aime.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #139673",
      "source": "tatoeba"
    },
    {
      "hanzi": "你饿了吗？",
      "pinyin": "Nǐ è le ma?",
      "french": "As-tu faim ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #380871",
      "source": "tatoeba"
    },
    {
      "hanzi": "祝贺你。",
      "pinyin": "Zhùhè nǐ.",
      "french": "Félicitations.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #335058",
      "source": "tatoeba"
    }
  ],
  "年": [
    {
      "hanzi": "我明年想学汉语。",
      "pinyin": "Wǒ míngnián xiǎng xué Hànyǔ.",
      "french": "Je veux apprendre le chinois l'année prochaine.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333627",
      "source": "tatoeba"
    },
    {
      "hanzi": "新年快乐！",
      "pinyin": "Xīnnián kuàilè!",
      "french": "Bonne année !",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #373237",
      "source": "tatoeba"
    },
    {
      "hanzi": "一百年叫做一个世纪。",
      "pinyin": "Yìbǎi nián jiàozuò yí ge shìjì.",
      "french": "Une centaine d'années est appelée un siècle.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #461264",
      "source": "tatoeba"
    }
  ],
  "女儿": [
    {
      "hanzi": "这是我女儿。",
      "pinyin": "Zhè shì wǒ nǚ'ér.",
      "french": "C'est ma fille.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #796082",
      "source": "tatoeba"
    },
    {
      "hanzi": "他有两个女儿。",
      "pinyin": "Tā yǒu liǎng ge nǚ'ér.",
      "french": "Il a deux filles.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #811296",
      "source": "tatoeba"
    },
    {
      "hanzi": "他一直很担心他的女儿。",
      "pinyin": "Tā yìzhí hěn dānxīn tā de nǚ'ér.",
      "french": "Il se fait tout le temps du souci au sujet de sa fille.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #332983",
      "source": "tatoeba"
    }
  ],
  "朋友": [
    {
      "hanzi": "他是你的朋友。",
      "pinyin": "Tā shì nǐ de péngyou.",
      "french": "Il est ton ami.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #2065338",
      "source": "tatoeba"
    },
    {
      "hanzi": "我没有朋友一起玩。",
      "pinyin": "Wǒ méiyǒu péngyou yìqǐ wán.",
      "french": "Je n'ai pas d'ami avec qui jouer.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #1490506",
      "source": "tatoeba"
    },
    {
      "hanzi": "他是我的朋友之一。",
      "pinyin": "Tā shì wǒ de péngyou zhīyī.",
      "french": "Il compte parmi mes amis.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9478788",
      "source": "tatoeba"
    }
  ],
  "漂亮": [
    {
      "hanzi": "她的女儿都很漂亮。",
      "pinyin": "Tā de nǚ'ér dōu hěn piàoliang.",
      "french": "Ses filles sont toutes jolies.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #6055157",
      "source": "tatoeba"
    },
    {
      "hanzi": "我叔叔给了我一块漂亮的手表。",
      "pinyin": "Wǒ shūshu gěi le wǒ yí kuài piàoliang de shǒubiǎo.",
      "french": "Mon oncle m'a donné une jolie montre.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333700",
      "source": "tatoeba"
    },
    {
      "hanzi": "她不但漂亮，而且聪明。",
      "pinyin": "Tā búdàn piàoliang, érqiě cōngming.",
      "french": "Elle est aussi intelligente qu'elle est belle.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #333469",
      "source": "tatoeba"
    }
  ],
  "苹果": [
    {
      "hanzi": "我们在吃苹果。",
      "pinyin": "Wǒmen zài chī píngguǒ.",
      "french": "Nous sommes en train de manger des pommes.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #8824081",
      "source": "tatoeba"
    },
    {
      "hanzi": "树上有些苹果，不是吗？",
      "pinyin": "Shù shang yǒu xiē píngguǒ, bú shì ma?",
      "french": "Il y a quelques pommes sur cet arbre, n'est-ce pas ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333097",
      "source": "tatoeba"
    },
    {
      "hanzi": "这只苹果非常红。",
      "pinyin": "Zhè zhī píngguǒ fēicháng hóng.",
      "french": "Cette pomme est très rouge.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #745929",
      "source": "tatoeba"
    }
  ],
  "七": [
    {
      "hanzi": "我七点钟再回来。",
      "pinyin": "Wǒ qī diǎnzhōng zài huílai.",
      "french": "À sept heures je serai de nouveau là.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #726785",
      "source": "tatoeba"
    },
    {
      "hanzi": "她七点起床。",
      "pinyin": "Tā qī diǎn qǐchuáng.",
      "french": "Elle se lève à sept heures.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #743100",
      "source": "tatoeba"
    },
    {
      "hanzi": "她十七岁结婚。",
      "pinyin": "Tā shíqī suì jiéhūn.",
      "french": "Elle s'est mariée à l'âge de dix-sept ans.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #2028008",
      "source": "tatoeba"
    }
  ],
  "前面": [
    {
      "hanzi": "商店在学校前面。",
      "pinyin": "Shāngdiàn zài xuéxiào qiánmian.",
      "french": "Le magasin est devant l'école.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "前面有一个火车站。",
      "pinyin": "Qiánmian yǒu yí ge huǒchēzhàn.",
      "french": "Il y a une gare devant.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "在我前面走。",
      "pinyin": "Zài wǒ qiánmian zǒu.",
      "french": "Marche devant moi.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #517553",
      "source": "tatoeba"
    }
  ],
  "请": [
    {
      "hanzi": "请坐。",
      "pinyin": "Qǐng zuò.",
      "french": "Asseyez-vous, s'il vous plaît.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #664551",
      "source": "tatoeba"
    },
    {
      "hanzi": "请进！",
      "pinyin": "Qǐng jìn!",
      "french": "Entrez !",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #348105",
      "source": "tatoeba"
    },
    {
      "hanzi": "请关门。",
      "pinyin": "Qǐng guānmén.",
      "french": "Fermez la porte.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #396001",
      "source": "tatoeba"
    }
  ],
  "热": [
    {
      "hanzi": "今天很热。",
      "pinyin": "Jīntiān hěn rè.",
      "french": "Il fait très chaud aujourd'hui.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #343752",
      "source": "tatoeba"
    },
    {
      "hanzi": "这里非常热。",
      "pinyin": "Zhèlǐ fēicháng rè.",
      "french": "Il fait très chaud ici.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #354123",
      "source": "tatoeba"
    },
    {
      "hanzi": "太阳提供我们光和热。",
      "pinyin": "Tàiyáng tígōng wǒmen guāng hé rè.",
      "french": "Le soleil nous dispense lumière et chaleur.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #4265916",
      "source": "tatoeba"
    }
  ],
  "人": [
    {
      "hanzi": "有人来了。",
      "pinyin": "Yǒu rén lái le.",
      "french": "Quelqu'un est venu.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #5092398",
      "source": "tatoeba"
    },
    {
      "hanzi": "那人是谁？",
      "pinyin": "Nà rén shì shéi?",
      "french": "Qui est cette personne ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #354121",
      "source": "tatoeba"
    },
    {
      "hanzi": "没有人理解我。",
      "pinyin": "Méiyǒu rén lǐjiě wǒ.",
      "french": "Personne ne me comprend.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334907",
      "source": "tatoeba"
    }
  ],
  "认识": [
    {
      "hanzi": "我认识你儿子。",
      "pinyin": "Wǒ rènshi nǐ érzi.",
      "french": "Je connais ton fils.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #10182738",
      "source": "tatoeba"
    },
    {
      "hanzi": "啊，我认识这个男人！",
      "pinyin": "Ā, wǒ rènshi zhège nánrén!",
      "french": "Oh ! Je connais cet homme.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #332467",
      "source": "tatoeba"
    },
    {
      "hanzi": "他好像认识我们。",
      "pinyin": "Tā hǎoxiàng rènshi wǒmen.",
      "french": "Il semble nous connaître.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #442161",
      "source": "tatoeba"
    }
  ],
  "日": [
    {
      "hanzi": "是十月三日。",
      "pinyin": "Shì shíyuè sān rì.",
      "french": "C'est le trois octobre.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #398978",
      "source": "tatoeba"
    },
    {
      "hanzi": "星期日开门吗？",
      "pinyin": "Xīngqīrì kāimén ma?",
      "french": "Est-ce ouvert le dimanche ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #679514",
      "source": "tatoeba"
    },
    {
      "hanzi": "他的生日是八月二十一日。",
      "pinyin": "Tā de shēngrì shì bāyuè èrshíyī rì.",
      "french": "Son anniversaire est le 21 août.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #432971",
      "source": "tatoeba"
    }
  ],
  "三": [
    {
      "hanzi": "我三十岁。",
      "pinyin": "Wǒ sānshí suì.",
      "french": "J'ai trente ans.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #8767504",
      "source": "tatoeba"
    },
    {
      "hanzi": "他有三个姐姐。",
      "pinyin": "Tā yǒu sān ge jiějie.",
      "french": "Il a trois grandes sœurs.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #469250",
      "source": "tatoeba"
    },
    {
      "hanzi": "我需要你的护照和三张照片。",
      "pinyin": "Wǒ xūyào nǐ de hùzhào hé sān zhāng zhàopiàn.",
      "french": "Il me faut votre passeport et trois photos.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334389",
      "source": "tatoeba"
    }
  ],
  "商店": [
    {
      "hanzi": "商店里有很多水果。",
      "pinyin": "Shāngdiàn li yǒu hěn duō shuǐguǒ.",
      "french": "Il y a beaucoup de fruits dans le magasin.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "我去商店。",
      "pinyin": "Wǒ qù shāngdiàn.",
      "french": "Je vais au magasin.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #1504028",
      "source": "tatoeba"
    },
    {
      "hanzi": "这个商店卖旧书。",
      "pinyin": "Zhège shāngdiàn mài jiù shū.",
      "french": "Cette échoppe vend de vieux livres.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #2298527",
      "source": "tatoeba"
    }
  ],
  "上": [
    {
      "hanzi": "猫坐在桌子上。",
      "pinyin": "Māo zuò zài zhuōzi shang.",
      "french": "Le chat est assis sur la table.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #347218",
      "source": "tatoeba"
    },
    {
      "hanzi": "桌子上有本书。",
      "pinyin": "Zhuōzi shang yǒu běn shū.",
      "french": "Il y a un livre sur la table.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #403709",
      "source": "tatoeba"
    },
    {
      "hanzi": "他爱上了她。",
      "pinyin": "Tā àishàng le tā.",
      "french": "Il est tombé amoureux d'elle.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #343787",
      "source": "tatoeba"
    }
  ],
  "上午": [
    {
      "hanzi": "我上午去学校。",
      "pinyin": "Wǒ shàngwǔ qù xuéxiào.",
      "french": "Le matin, je vais à l'école.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "他上午来过这里。",
      "pinyin": "Tā shàngwǔ láiguo zhèlǐ.",
      "french": "Il est venu ici ce matin.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #809000",
      "source": "tatoeba"
    },
    {
      "hanzi": "学校在上午八点三十分开始上课。",
      "pinyin": "Xuéxiào zài shàngwǔ bā diǎn sānshí fēn kāishǐ shàngkè.",
      "french": "Les cours débutent le matin à huit heures trente.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #798350",
      "source": "tatoeba"
    }
  ],
  "少": [
    {
      "hanzi": "他很少来看我。",
      "pinyin": "Tā hěn shǎo lái kàn wǒ.",
      "french": "Il vient rarement me voir.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #471105",
      "source": "tatoeba"
    },
    {
      "hanzi": "她很少出去。",
      "pinyin": "Tā hěn shǎo chūqù.",
      "french": "Elle sort rarement dehors.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #354509",
      "source": "tatoeba"
    },
    {
      "hanzi": "少一把刀。",
      "pinyin": "Shǎo yì bǎ dāo.",
      "french": "Il manque un couteau.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #746030",
      "source": "tatoeba"
    }
  ],
  "什么": [
    {
      "hanzi": "这是什么？",
      "pinyin": "Zhè shì shénme?",
      "french": "Qu'est-ce que c'est ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #347292",
      "source": "tatoeba"
    },
    {
      "hanzi": "你想要什么？",
      "pinyin": "Nǐ xiǎngyào shénme?",
      "french": "Que veux-tu ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333098",
      "source": "tatoeba"
    },
    {
      "hanzi": "你在干什么？",
      "pinyin": "Nǐ zài gàn shénme?",
      "french": "Qu'est-ce que tu fais ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #659301",
      "source": "tatoeba"
    }
  ],
  "十": [
    {
      "hanzi": "我十八岁。",
      "pinyin": "Wǒ shíbā suì.",
      "french": "J'ai dix-huit ans.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #349902",
      "source": "tatoeba"
    },
    {
      "hanzi": "昨天我十点去睡觉了。",
      "pinyin": "Zuótiān wǒ shí diǎn qù shuìjiào le.",
      "french": "Hier, je me suis couché à dix heures.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #674239",
      "source": "tatoeba"
    },
    {
      "hanzi": "她会十门语言。",
      "pinyin": "Tā huì shí mén yǔyán.",
      "french": "Elle sait parler dix langues.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #394862",
      "source": "tatoeba"
    }
  ],
  "时候": [
    {
      "hanzi": "你什么时候来？",
      "pinyin": "Nǐ shénme shíhou lái?",
      "french": "Quand viens-tu ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #11502926",
      "source": "tatoeba"
    },
    {
      "hanzi": "我不在的时候有没有人来？",
      "pinyin": "Wǒ bú zài de shíhou yǒu méiyǒu rén lái?",
      "french": "Quelqu'un est-il venu pendant mon absence ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #402916",
      "source": "tatoeba"
    },
    {
      "hanzi": "你想走的时候就走吧。",
      "pinyin": "Nǐ xiǎng zǒu de shíhou jiù zǒu ba.",
      "french": "Pars quand tu veux.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #332528",
      "source": "tatoeba"
    }
  ],
  "是": [
    {
      "hanzi": "是我。",
      "pinyin": "Shì wǒ.",
      "french": "C'est moi.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #335161",
      "source": "tatoeba"
    },
    {
      "hanzi": "这是找零。",
      "pinyin": "Zhè shì zhǎolíng.",
      "french": "Voici la monnaie.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #332834",
      "source": "tatoeba"
    },
    {
      "hanzi": "是警察！",
      "pinyin": "Shì jǐngchá!",
      "french": "Ce sont les flics !",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9419152",
      "source": "tatoeba"
    }
  ],
  "书": [
    {
      "hanzi": "哪本是你的书？",
      "pinyin": "Nǎ běn shì nǐ de shū?",
      "french": "Quel livre est le tien ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #334623",
      "source": "tatoeba"
    },
    {
      "hanzi": "他在看书。",
      "pinyin": "Tā zài kànshū.",
      "french": "Il lit un livre.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #1160771",
      "source": "tatoeba"
    },
    {
      "hanzi": "这本书我能借多久？",
      "pinyin": "Zhè běn shū wǒ néng jiè duōjiǔ?",
      "french": "Combien de temps puis-je garder ce livre ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #333402",
      "source": "tatoeba"
    }
  ],
  "谁": [
    {
      "hanzi": "你是谁？",
      "pinyin": "Nǐ shì shéi?",
      "french": "Qui es-tu ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #395853",
      "source": "tatoeba"
    },
    {
      "hanzi": "谁会信呢？",
      "pinyin": "Shéi huì xìn ne?",
      "french": "Qui va croire ça ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #4815169",
      "source": "tatoeba"
    },
    {
      "hanzi": "这把伞是谁的？",
      "pinyin": "Zhè bǎ sǎn shì shéi de?",
      "french": "À qui est ce parapluie ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #360560",
      "source": "tatoeba"
    }
  ],
  "水果": [
    {
      "hanzi": "我喜欢水果。",
      "pinyin": "Wǒ xǐhuan shuǐguǒ.",
      "french": "J'aime les fruits.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #4105310",
      "source": "tatoeba"
    },
    {
      "hanzi": "我发现一个地方能买到便宜的水果。",
      "pinyin": "Wǒ fāxiàn yí ge dìfang néng mǎidào piányi de shuǐguǒ.",
      "french": "J'ai trouvé un endroit où l'on peut acheter des fruits bon marché.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #344217",
      "source": "tatoeba"
    },
    {
      "hanzi": "新鲜水果对身体好。",
      "pinyin": "Xīnxiān shuǐguǒ duì shēntǐ hǎo.",
      "french": "Les fruits frais sont bons pour ta santé.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #339219",
      "source": "tatoeba"
    }
  ],
  "睡觉": [
    {
      "hanzi": "我想睡觉。",
      "pinyin": "Wǒ xiǎng shuìjiào.",
      "french": "Je veux dormir.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #380912",
      "source": "tatoeba"
    },
    {
      "hanzi": "睡觉时间到了。",
      "pinyin": "Shuìjiào shíjiān dào le.",
      "french": "Il est temps de dormir.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #406727",
      "source": "tatoeba"
    },
    {
      "hanzi": "你应该去睡觉了吧。",
      "pinyin": "Nǐ yīnggāi qù shuìjiào le ba.",
      "french": "Tu devrais dormir.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #32",
      "source": "tatoeba"
    }
  ],
  "说话": [
    {
      "hanzi": "她不说话。",
      "pinyin": "Tā bù shuōhuà.",
      "french": "Elle ne parle pas.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #11510495",
      "source": "tatoeba"
    },
    {
      "hanzi": "不要说话了。",
      "pinyin": "Bú yào shuōhuà le.",
      "french": "Arrête de parler.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #5092251",
      "source": "tatoeba"
    },
    {
      "hanzi": "你在跟我说话吗？",
      "pinyin": "Nǐ zài gēn wǒ shuōhuà ma?",
      "french": "C'est à moi que tu parles ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #478844",
      "source": "tatoeba"
    }
  ],
  "四": [
    {
      "hanzi": "今天是星期四。",
      "pinyin": "Jīntiān shì xīngqīsì.",
      "french": "Aujourd'hui, on est jeudi.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #5142184",
      "source": "tatoeba"
    },
    {
      "hanzi": "你有四只狗。",
      "pinyin": "Nǐ yǒu sì zhī gǒu.",
      "french": "Tu as quatre chiens.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #558665",
      "source": "tatoeba"
    },
    {
      "hanzi": "他已经超过四十岁了。",
      "pinyin": "Tā yǐjīng chāoguò sìshí suì le.",
      "french": "Il a passé la quarantaine.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #949255",
      "source": "tatoeba"
    }
  ],
  "岁": [
    {
      "hanzi": "你几岁了？",
      "pinyin": "Nǐ jǐ suì le?",
      "french": "Quel âge avez-vous ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #345427",
      "source": "tatoeba"
    },
    {
      "hanzi": "他比她大三岁。",
      "pinyin": "Tā bǐ tā dà sān suì.",
      "french": "Il a 3 ans de plus qu'elle.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #1891664",
      "source": "tatoeba"
    },
    {
      "hanzi": "他的哥哥比我大两岁。",
      "pinyin": "Tā de gēge bǐ wǒ dà liǎng suì.",
      "french": "Son frère aîné a deux ans de plus que moi.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #343614",
      "source": "tatoeba"
    }
  ],
  "他": [
    {
      "hanzi": "他是医生。",
      "pinyin": "Tā shì yīshēng.",
      "french": "Il est médecin.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #348032",
      "source": "tatoeba"
    },
    {
      "hanzi": "他在踢我！",
      "pinyin": "Tā zài tī wǒ!",
      "french": "Il me donne des coups de pied !",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #42",
      "source": "tatoeba"
    },
    {
      "hanzi": "他很懒。",
      "pinyin": "Tā hěn lǎn.",
      "french": "Il est fainéant.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #343917",
      "source": "tatoeba"
    }
  ],
  "她": [
    {
      "hanzi": "她来了！",
      "pinyin": "Tā lái le!",
      "french": "Elle est venue !",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333982",
      "source": "tatoeba"
    },
    {
      "hanzi": "我认识她。",
      "pinyin": "Wǒ rènshi tā.",
      "french": "Je la connais.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #772314",
      "source": "tatoeba"
    },
    {
      "hanzi": "她很少出去。",
      "pinyin": "Tā hěn shǎo chūqù.",
      "french": "Elle sort rarement dehors.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #354509",
      "source": "tatoeba"
    }
  ],
  "太": [
    {
      "hanzi": "我太高兴了！",
      "pinyin": "Wǒ tài gāoxìng le!",
      "french": "Je suis trop heureux !",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1539554",
      "source": "tatoeba"
    },
    {
      "hanzi": "太贵了！",
      "pinyin": "Tài guì le!",
      "french": "C'est trop cher !",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #399956",
      "source": "tatoeba"
    },
    {
      "hanzi": "太可惜了！",
      "pinyin": "Tài kěxī le!",
      "french": "Quel dommage !",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #332578",
      "source": "tatoeba"
    }
  ],
  "天气": [
    {
      "hanzi": "今天天气很好。",
      "pinyin": "Jīntiān tiānqì hěn hǎo.",
      "french": "Il fait beau aujourd'hui.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333127",
      "source": "tatoeba"
    },
    {
      "hanzi": "今天天气很好，和明天一样。",
      "pinyin": "Jīntiān tiānqì hěn hǎo, hé míngtiān yíyàng.",
      "french": "Il fait beau aujourd'hui, comme demain.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #334187",
      "source": "tatoeba"
    },
    {
      "hanzi": "天气挺冷的。",
      "pinyin": "Tiānqì tǐng lěng de.",
      "french": "Il fait assez froid.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #358977",
      "source": "tatoeba"
    }
  ],
  "听": [
    {
      "hanzi": "你在听我说吗？",
      "pinyin": "Nǐ zài tīng wǒ shuō ma?",
      "french": "Est-ce que tu m'écoutes ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #332820",
      "source": "tatoeba"
    },
    {
      "hanzi": "我正在听音乐。",
      "pinyin": "Wǒ zhèngzài tīng yīnyuè.",
      "french": "Je suis en train d'écouter de la musique.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #804865",
      "source": "tatoeba"
    },
    {
      "hanzi": "她还没听到这个消息。",
      "pinyin": "Tā hái méi tīngdào zhège xiāoxi.",
      "french": "Elle n'a pas encore entendu la nouvelle.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334281",
      "source": "tatoeba"
    }
  ],
  "同学": [
    {
      "hanzi": "我们是同学。",
      "pinyin": "Wǒmen shì tóngxué.",
      "french": "Nous sommes des copains de classe.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #333784",
      "source": "tatoeba"
    },
    {
      "hanzi": "我没有一个同学住在这儿附近。",
      "pinyin": "Wǒ méiyǒu yí ge tóngxué zhù zài zhèr fùjìn.",
      "french": "Aucun de mes camarades de classe ne vit près d'ici.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333715",
      "source": "tatoeba"
    },
    {
      "hanzi": "我班上的所有同学都很友好。",
      "pinyin": "Wǒ bānshàng de suǒyǒu tóngxué dōu hěn yǒuhǎo.",
      "french": "Tous les étudiants de ma classe sont sympa.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #343994",
      "source": "tatoeba"
    }
  ],
  "喂": [
    {
      "hanzi": "喂，你在哪里？",
      "pinyin": "Wéi, nǐ zài nǎlǐ?",
      "french": "Allô, où es-tu ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "喂？你还在吗？",
      "pinyin": "Wéi? Nǐ hái zài ma?",
      "french": "Allô ? T'es toujours là ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #502848",
      "source": "tatoeba"
    },
    {
      "hanzi": "“喂，哪一位啊？”",
      "pinyin": "“Wéi, nǎ yí wèi a?”",
      "french": "« Allô, c'est qui ? »",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #409196",
      "source": "tatoeba"
    }
  ],
  "我": [
    {
      "hanzi": "我是老师。",
      "pinyin": "Wǒ shì lǎoshī.",
      "french": "Je suis enseignant.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1050441",
      "source": "tatoeba"
    },
    {
      "hanzi": "我同意。",
      "pinyin": "Wǒ tóngyì.",
      "french": "Je suis d'accord.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333224",
      "source": "tatoeba"
    },
    {
      "hanzi": "让我试试。",
      "pinyin": "Ràng wǒ shìshi.",
      "french": "Laisse-moi essayer.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #333051",
      "source": "tatoeba"
    }
  ],
  "我们": [
    {
      "hanzi": "我们能在哪儿打电话？",
      "pinyin": "Wǒmen néng zài nǎr dǎ diànhuà?",
      "french": "Où peut-on téléphoner ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #501694",
      "source": "tatoeba"
    },
    {
      "hanzi": "回答我们。",
      "pinyin": "Huídá wǒmen.",
      "french": "Réponds-nous.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #12169566",
      "source": "tatoeba"
    },
    {
      "hanzi": "我们完成了吗？",
      "pinyin": "Wǒmen wánchéng le ma?",
      "french": "Avons-nous terminé ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #1783788",
      "source": "tatoeba"
    }
  ],
  "五": [
    {
      "hanzi": "他五点钟回来的。",
      "pinyin": "Tā wǔ diǎnzhōng huílai de.",
      "french": "Il est revenu à cinq heures.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1228441",
      "source": "tatoeba"
    },
    {
      "hanzi": "我五点到你家来接你。",
      "pinyin": "Wǒ wǔ diǎn dào nǐ jiā lái jiē nǐ.",
      "french": "Je passe te prendre chez toi à cinq heures.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333216",
      "source": "tatoeba"
    },
    {
      "hanzi": "我不喜欢五百页以上的书。",
      "pinyin": "Wǒ bù xǐhuan wǔ bǎi yè yǐshàng de shū.",
      "french": "Je n'aime pas les livres de plus de cinq cents pages.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #8792133",
      "source": "tatoeba"
    }
  ],
  "喜欢": [
    {
      "hanzi": "你喜欢吗？",
      "pinyin": "Nǐ xǐhuan ma?",
      "french": "Tu aimes ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #423413",
      "source": "tatoeba"
    },
    {
      "hanzi": "我喜欢数学。",
      "pinyin": "Wǒ xǐhuan shùxué.",
      "french": "J'aime les maths.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #708143",
      "source": "tatoeba"
    },
    {
      "hanzi": "你喜欢音乐吗？",
      "pinyin": "Nǐ xǐhuan yīnyuè ma?",
      "french": "Est-ce que tu aimes la musique ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #333747",
      "source": "tatoeba"
    }
  ],
  "下": [
    {
      "hanzi": "我下了火车。",
      "pinyin": "Wǒ xià le huǒchē.",
      "french": "Je suis descendu du train.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #414029",
      "source": "tatoeba"
    },
    {
      "hanzi": "现在休息一下。",
      "pinyin": "Xiànzài xiūxi yíxià.",
      "french": "Faisons une pause maintenant.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333585",
      "source": "tatoeba"
    },
    {
      "hanzi": "我想要留下。",
      "pinyin": "Wǒ xiǎngyào liúxià.",
      "french": "Je veux rester.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9178046",
      "source": "tatoeba"
    }
  ],
  "下午": [
    {
      "hanzi": "下午我不在家。",
      "pinyin": "Xiàwǔ wǒ bú zài jiā.",
      "french": "Je serai absent de la maison l'après-midi.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #423411",
      "source": "tatoeba"
    },
    {
      "hanzi": "我今天下午不想出外。",
      "pinyin": "Wǒ jīntiān xiàwǔ bù xiǎng chūwài.",
      "french": "Je ne veux pas sortir cet après-midi.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #423886",
      "source": "tatoeba"
    },
    {
      "hanzi": "请下午来我的办公室。",
      "pinyin": "Qǐng xiàwǔ lái wǒ de bàngōngshì.",
      "french": "S'il vous plait venez à mon bureau dans l'après-midi.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #437281",
      "source": "tatoeba"
    }
  ],
  "下雨": [
    {
      "hanzi": "下雨了。",
      "pinyin": "Xià yǔ le.",
      "french": "Il pleut.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #346836",
      "source": "tatoeba"
    },
    {
      "hanzi": "终于开始下雨了。",
      "pinyin": "Zhōngyú kāishǐ xià yǔ le.",
      "french": "Il a enfin commencé à pleuvoir.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #431501",
      "source": "tatoeba"
    },
    {
      "hanzi": "如果明天下雨，我们就不会去那里。",
      "pinyin": "Rúguǒ míngtiān xià yǔ, wǒmen jiù bú huì qù nàlǐ.",
      "french": "S'il pleut demain, nous n'y irons pas.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #339914",
      "source": "tatoeba"
    }
  ],
  "先生": [
    {
      "hanzi": "王先生是中国人。",
      "pinyin": "Wáng xiānsheng shì Zhōngguórén.",
      "french": "Monsieur Wang est chinois.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #470269",
      "source": "tatoeba"
    },
    {
      "hanzi": "先生，我想找一份工作。",
      "pinyin": "Xiānsheng, wǒ xiǎng zhǎo yí fèn gōngzuò.",
      "french": "Je recherche un emploi, Monsieur.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #421004",
      "source": "tatoeba"
    },
    {
      "hanzi": "“一只猫？”老先生问。",
      "pinyin": "“Yì zhī māo?” lǎo xiānsheng wèn.",
      "french": "\"Un chat ?\" demanda le vieil homme.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334150",
      "source": "tatoeba"
    }
  ],
  "现在": [
    {
      "hanzi": "你现在在哪里呢？",
      "pinyin": "Nǐ xiànzài zài nǎlǐ ne?",
      "french": "Où es-tu en ce moment ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1468442",
      "source": "tatoeba"
    },
    {
      "hanzi": "现在休息一下。",
      "pinyin": "Xiànzài xiūxi yíxià.",
      "french": "Faisons une pause maintenant.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333585",
      "source": "tatoeba"
    },
    {
      "hanzi": "现在学生在放假。",
      "pinyin": "Xiànzài xuésheng zài fàngjià.",
      "french": "Les étudiants sont en vacances actuellement.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #343741",
      "source": "tatoeba"
    }
  ],
  "想": [
    {
      "hanzi": "我想看看。",
      "pinyin": "Wǒ xiǎng kànkan.",
      "french": "Je voudrais le voir.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #332819",
      "source": "tatoeba"
    },
    {
      "hanzi": "我想哭。",
      "pinyin": "Wǒ xiǎng kū.",
      "french": "J'avais envie de pleurer.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #334542",
      "source": "tatoeba"
    },
    {
      "hanzi": "我想要留下。",
      "pinyin": "Wǒ xiǎngyào liúxià.",
      "french": "Je veux rester.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9178046",
      "source": "tatoeba"
    }
  ],
  "小姐": [
    {
      "hanzi": "王小姐是老师。",
      "pinyin": "Wáng xiǎojiě shì lǎoshī.",
      "french": "Mademoiselle Wang est enseignante.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "小姐，我想买这个。",
      "pinyin": "Xiǎojiě, wǒ xiǎng mǎi zhège.",
      "french": "Mademoiselle, je voudrais acheter ceci.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "我能和布朗小姐说话吗？",
      "pinyin": "Wǒ néng hé Bùlǎng xiǎojiě shuōhuà ma?",
      "french": "Puis-je parler à Mlle Brown ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #501427",
      "source": "tatoeba"
    }
  ],
  "些": [
    {
      "hanzi": "他说了些什么。",
      "pinyin": "Tā shuō le xiē shénme.",
      "french": "Il a dit quelque chose.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #7771887",
      "source": "tatoeba"
    },
    {
      "hanzi": "我可以做些什么？",
      "pinyin": "Wǒ kěyǐ zuò xiē shénme?",
      "french": "Que puis-je faire ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #10733777",
      "source": "tatoeba"
    },
    {
      "hanzi": "树上有些苹果，不是吗？",
      "pinyin": "Shù shang yǒu xiē píngguǒ, bú shì ma?",
      "french": "Il y a quelques pommes sur cet arbre, n'est-ce pas ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #333097",
      "source": "tatoeba"
    }
  ],
  "写": [
    {
      "hanzi": "我的名字不是这样写的。",
      "pinyin": "Wǒ de míngzi bú shì zhèyàng xiě de.",
      "french": "Mon nom ne s'écrit pas comme ça.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #13034074",
      "source": "tatoeba"
    },
    {
      "hanzi": "他很难写他的名字。",
      "pinyin": "Tā hěn nán xiě tā de míngzi.",
      "french": "Il arrive difficilement à écrire son nom.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333184",
      "source": "tatoeba"
    },
    {
      "hanzi": "把你的名字用大写写下来。",
      "pinyin": "Bǎ nǐ de míngzi yòng dàxiě xiě xialai.",
      "french": "Écrivez votre nom en majuscules.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #333145",
      "source": "tatoeba"
    }
  ],
  "谢谢": [
    {
      "hanzi": "谢谢你。",
      "pinyin": "Xièxie nǐ.",
      "french": "Merci à toi.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #374825",
      "source": "tatoeba"
    },
    {
      "hanzi": "我已经吃饱了，谢谢。",
      "pinyin": "Wǒ yǐjīng chībǎo le, xièxie.",
      "french": "J'en ai eu suffisamment, merci.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333663",
      "source": "tatoeba"
    },
    {
      "hanzi": "谢谢你的耐心。",
      "pinyin": "Xièxie nǐ de nàixīn.",
      "french": "Merci pour votre patience.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #335869",
      "source": "tatoeba"
    }
  ],
  "星期": [
    {
      "hanzi": "星期天他会一个人来。",
      "pinyin": "Xīngqītiān tā huì yí ge rén lái.",
      "french": "Il viendra seul dimanche.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #2040496",
      "source": "tatoeba"
    },
    {
      "hanzi": "星期一，我不用工作。",
      "pinyin": "Xīngqīyī, wǒ bú yòng gōngzuò.",
      "french": "Le lundi je ne travaille pas.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #726750",
      "source": "tatoeba"
    },
    {
      "hanzi": "上个星期我们在我阿姨的家。",
      "pinyin": "Shàng ge xīngqī wǒmen zài wǒ āyí de jiā.",
      "french": "Nous étions chez ma tante la semaine dernière.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9489479",
      "source": "tatoeba"
    }
  ],
  "学生": [
    {
      "hanzi": "这个学校有很多学生。",
      "pinyin": "Zhège xuéxiào yǒu hěn duō xuésheng.",
      "french": "Cette école a beaucoup d'étudiants.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #530704",
      "source": "tatoeba"
    },
    {
      "hanzi": "其他学生都笑了。",
      "pinyin": "Qítā xuésheng dōu xiào le.",
      "french": "Les autres étudiants ont ri.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #9453452",
      "source": "tatoeba"
    },
    {
      "hanzi": "现在学生在放假。",
      "pinyin": "Xiànzài xuésheng zài fàngjià.",
      "french": "Les étudiants sont en vacances actuellement.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #343741",
      "source": "tatoeba"
    }
  ],
  "学习": [
    {
      "hanzi": "我学习汉语。",
      "pinyin": "Wǒ xuéxí Hànyǔ.",
      "french": "J'apprends le chinois.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #2321655",
      "source": "tatoeba"
    },
    {
      "hanzi": "您学习吗？",
      "pinyin": "Nín xuéxí ma?",
      "french": "Étudiez-vous ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #332662",
      "source": "tatoeba"
    },
    {
      "hanzi": "我需要学习数学。",
      "pinyin": "Wǒ xūyào xuéxí shùxué.",
      "french": "J'ai besoin d'étudier les maths.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #792855",
      "source": "tatoeba"
    }
  ],
  "学校": [
    {
      "hanzi": "你怎么去学校？",
      "pinyin": "Nǐ zěnme qù xuéxiào?",
      "french": "Comment te rends-tu à l'école ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #408856",
      "source": "tatoeba"
    },
    {
      "hanzi": "我们必须去学校了。",
      "pinyin": "Wǒmen bìxū qù xuéxiào le.",
      "french": "Nous devons aller à l'école.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #334285",
      "source": "tatoeba"
    },
    {
      "hanzi": "我叔叔住在学校附近。",
      "pinyin": "Wǒ shūshu zhù zài xuéxiào fùjìn.",
      "french": "Mon oncle vit près de l'école.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #332488",
      "source": "tatoeba"
    }
  ],
  "一": [
    {
      "hanzi": "他是一个朋友吗？",
      "pinyin": "Tā shì yí ge péngyou ma?",
      "french": "C'est un ami ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #11518464",
      "source": "tatoeba"
    },
    {
      "hanzi": "给我一点儿。",
      "pinyin": "Gěi wǒ yìdiǎnr.",
      "french": "Donne-m'en.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #869811",
      "source": "tatoeba"
    },
    {
      "hanzi": "少一把刀。",
      "pinyin": "Shǎo yì bǎ dāo.",
      "french": "Il manque un couteau.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #746030",
      "source": "tatoeba"
    }
  ],
  "衣服": [
    {
      "hanzi": "我今天去买衣服了。",
      "pinyin": "Wǒ jīntiān qù mǎi yīfu le.",
      "french": "Je suis allé acheter des habits aujourd'hui.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1512392",
      "source": "tatoeba"
    },
    {
      "hanzi": "我看见一个穿黑衣服的女人。",
      "pinyin": "Wǒ kànjiàn yí ge chuān hēi yīfu de nǚrén.",
      "french": "J'ai vu une femme en noir.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #333954",
      "source": "tatoeba"
    },
    {
      "hanzi": "他不仅给了我们衣服，还有一点钱。",
      "pinyin": "Tā bùjǐn gěi le wǒmen yīfu, hái yǒu yìdiǎn qián.",
      "french": "Il nous donna non seulement des habits, mais aussi un peu d'argent.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334409",
      "source": "tatoeba"
    }
  ],
  "医生": [
    {
      "hanzi": "她是医生。",
      "pinyin": "Tā shì yīshēng.",
      "french": "Elle est médecin.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #334971",
      "source": "tatoeba"
    },
    {
      "hanzi": "您应该去看看医生。",
      "pinyin": "Nín yīnggāi qù kànkan yīshēng.",
      "french": "Vous devriez voir un docteur.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #2437268",
      "source": "tatoeba"
    },
    {
      "hanzi": "你去看过医生了吗？",
      "pinyin": "Nǐ qù kànguo yīshēng le ma?",
      "french": "Êtes-vous allé voir un médecin ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #397553",
      "source": "tatoeba"
    }
  ],
  "医院": [
    {
      "hanzi": "他在医院。",
      "pinyin": "Tā zài yīyuàn.",
      "french": "Il est à l'hôpital.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1169502",
      "source": "tatoeba"
    },
    {
      "hanzi": "我必须去医院吗？",
      "pinyin": "Wǒ bìxū qù yīyuàn ma?",
      "french": "Dois-je aller à l'hôpital ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #2109195",
      "source": "tatoeba"
    },
    {
      "hanzi": "我父亲现在在医院。",
      "pinyin": "Wǒ fùqīn xiànzài zài yīyuàn.",
      "french": "Mon père est maintenant à l'hôpital.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #510655",
      "source": "tatoeba"
    }
  ],
  "椅子": [
    {
      "hanzi": "猫在椅子上睡觉。",
      "pinyin": "Māo zài yǐzi shang shuìjiào.",
      "french": "Le chat dort sur la chaise.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #2827154",
      "source": "tatoeba"
    },
    {
      "hanzi": "这是张舒服的椅子。",
      "pinyin": "Zhè shì zhāng shūfu de yǐzi.",
      "french": "C'est une chaise confortable.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #335033",
      "source": "tatoeba"
    },
    {
      "hanzi": "你的椅子和我的很像。",
      "pinyin": "Nǐ de yǐzi hé wǒ de hěn xiàng.",
      "french": "Tes chaises ressemblent beaucoup aux miennes.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #1225645",
      "source": "tatoeba"
    }
  ],
  "有": [
    {
      "hanzi": "他有很多钱。",
      "pinyin": "Tā yǒu hěn duō qián.",
      "french": "Il a beaucoup d'argent.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #480581",
      "source": "tatoeba"
    },
    {
      "hanzi": "你有铅笔吗？",
      "pinyin": "Nǐ yǒu qiānbǐ ma?",
      "french": "Est-ce que tu as un crayon ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #424507",
      "source": "tatoeba"
    },
    {
      "hanzi": "有借有还。",
      "pinyin": "Yǒu jiè yǒu huán.",
      "french": "Il faut rendre ce qu'on a emprunté.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #392283",
      "source": "tatoeba"
    }
  ],
  "月": [
    {
      "hanzi": "这个月是几月？",
      "pinyin": "Zhège yuè shì jǐ yuè?",
      "french": "Quel mois sommes-nous ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #385103",
      "source": "tatoeba"
    },
    {
      "hanzi": "他下月会很忙。",
      "pinyin": "Tā xiàyuè huì hěn máng.",
      "french": "Il sera très occupé le mois prochain.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #345857",
      "source": "tatoeba"
    },
    {
      "hanzi": "我一月份要参加考试。",
      "pinyin": "Wǒ yīyuèfèn yào cānjiā kǎoshì.",
      "french": "Je passe un examen en janvier.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334499",
      "source": "tatoeba"
    }
  ],
  "再见": [
    {
      "hanzi": "老师，再见！",
      "pinyin": "Lǎoshī, zàijiàn!",
      "french": "Au revoir, professeur !",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "再见，明天见。",
      "pinyin": "Zàijiàn, míngtiān jiàn.",
      "french": "Au revoir et à demain.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #390442",
      "source": "tatoeba"
    },
    {
      "hanzi": "啊，他们什么时候会再见？",
      "pinyin": "Ā, tāmen shénme shíhou huì zàijiàn?",
      "french": "Ah, quand se reverront-ils ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #794226",
      "source": "tatoeba"
    }
  ],
  "在": [
    {
      "hanzi": "谁在听？",
      "pinyin": "Shéi zài tīng?",
      "french": "Qui écoute ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #10787289",
      "source": "tatoeba"
    },
    {
      "hanzi": "他在踢我！",
      "pinyin": "Tā zài tī wǒ!",
      "french": "Il me donne des coups de pied !",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #42",
      "source": "tatoeba"
    },
    {
      "hanzi": "马在哪里？",
      "pinyin": "Mǎ zài nǎlǐ?",
      "french": "Où sont les chevaux ?",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9489491",
      "source": "tatoeba"
    }
  ],
  "怎么": [
    {
      "hanzi": "你们怎么做的？",
      "pinyin": "Nǐmen zěnme zuò de?",
      "french": "Comment avez-vous fait ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #721037",
      "source": "tatoeba"
    },
    {
      "hanzi": "你怎么会不知道？",
      "pinyin": "Nǐ zěnme huì bù zhīdào?",
      "french": "Comment se fait-il que tu ne le saches pas ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #334830",
      "source": "tatoeba"
    },
    {
      "hanzi": "护士会告诉你怎么做。",
      "pinyin": "Hùshi huì gàosu nǐ zěnme zuò.",
      "french": "L'infirmière te dira comment faire.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #332607",
      "source": "tatoeba"
    }
  ],
  "怎么样": [
    {
      "hanzi": "你今天怎么样？",
      "pinyin": "Nǐ jīntiān zěnmeyàng?",
      "french": "Comment vas-tu aujourd'hui ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #388517",
      "source": "tatoeba"
    },
    {
      "hanzi": "你觉得怎么样？",
      "pinyin": "Nǐ juéde zěnmeyàng?",
      "french": "Qu'en penses-tu ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #336719",
      "source": "tatoeba"
    },
    {
      "hanzi": "“你感觉怎么样？”他问。",
      "pinyin": "“Nǐ gǎnjué zěnmeyàng?” tā wèn.",
      "french": "Comment te sens-tu ? demanda-t-il.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334171",
      "source": "tatoeba"
    }
  ],
  "这": [
    {
      "hanzi": "这是谁的？",
      "pinyin": "Zhè shì shéi de?",
      "french": "À qui est-ce ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #1314463",
      "source": "tatoeba"
    },
    {
      "hanzi": "这很难。",
      "pinyin": "Zhè hěn nán.",
      "french": "C'est difficile.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #869094",
      "source": "tatoeba"
    },
    {
      "hanzi": "这很危险。",
      "pinyin": "Zhè hěn wēixiǎn.",
      "french": "C'est très dangereux.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #9466906",
      "source": "tatoeba"
    }
  ],
  "中国": [
    {
      "hanzi": "他是中国人。",
      "pinyin": "Tā shì Zhōngguórén.",
      "french": "Il est chinois.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #2110987",
      "source": "tatoeba"
    },
    {
      "hanzi": "他从中国回来了。",
      "pinyin": "Tā cóng Zhōngguó huílai le.",
      "french": "Il est revenu de Chine.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #343360",
      "source": "tatoeba"
    },
    {
      "hanzi": "他明天出发去中国。",
      "pinyin": "Tā míngtiān chūfā qù Zhōngguó.",
      "french": "Il part pour la Chine demain.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #363883",
      "source": "tatoeba"
    }
  ],
  "中午": [
    {
      "hanzi": "中午我在家吃饭。",
      "pinyin": "Zhōngwǔ wǒ zài jiā chīfàn.",
      "french": "À midi, je mange à la maison.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "你中午吃了什么？",
      "pinyin": "Nǐ zhōngwǔ chī le shénme?",
      "french": "Tu as mangé quoi, ce midi ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #2298229",
      "source": "tatoeba"
    },
    {
      "hanzi": "让她中午过来。",
      "pinyin": "Ràng tā zhōngwǔ guòlai.",
      "french": "Dites-lui de venir à midi.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #375286",
      "source": "tatoeba"
    }
  ],
  "住": [
    {
      "hanzi": "你住在哪里？",
      "pinyin": "Nǐ zhù zài nǎlǐ?",
      "french": "Où habites-tu ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #136401",
      "source": "tatoeba"
    },
    {
      "hanzi": "她现在住在哪儿？",
      "pinyin": "Tā xiànzài zhù zài nǎr?",
      "french": "Où réside-t-elle maintenant ?",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #829559",
      "source": "tatoeba"
    },
    {
      "hanzi": "我在这里住了三十年了。",
      "pinyin": "Wǒ zài zhèlǐ zhù le sānshí nián le.",
      "french": "J'ai vécu ici pendant trente ans.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #470461",
      "source": "tatoeba"
    }
  ],
  "桌子": [
    {
      "hanzi": "桌子上有本书。",
      "pinyin": "Zhuōzi shang yǒu běn shū.",
      "french": "Il y a un livre sur la table.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #403709",
      "source": "tatoeba"
    },
    {
      "hanzi": "这张桌子是干净的。",
      "pinyin": "Zhè zhāng zhuōzi shì gānjìng de.",
      "french": "Cette table est propre.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #431040",
      "source": "tatoeba"
    },
    {
      "hanzi": "钥匙在桌子上。",
      "pinyin": "Yàoshi zài zhuōzi shang.",
      "french": "Les clés sont sur la table.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #349271",
      "source": "tatoeba"
    }
  ],
  "字": [
    {
      "hanzi": "你会读这个汉字吗？",
      "pinyin": "Nǐ huì dú zhège Hànzì ma?",
      "french": "Peux-tu lire ce caractère chinois ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #433697",
      "source": "tatoeba"
    },
    {
      "hanzi": "有很多字我不懂。",
      "pinyin": "Yǒu hěn duō zì wǒ bù dǒng.",
      "french": "Il y a beaucoup de mots que je ne comprends pas.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #345992",
      "source": "tatoeba"
    },
    {
      "hanzi": "她不能写字也不能看书。",
      "pinyin": "Tā bù néng xiězì yě bù néng kànshū.",
      "french": "Elle ne peut ni écrire ni lire.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #784565",
      "source": "tatoeba"
    }
  ],
  "昨天": [
    {
      "hanzi": "昨天下雨了。",
      "pinyin": "Zuótiān xià yǔ le.",
      "french": "Il a plu hier.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #819458",
      "source": "tatoeba"
    },
    {
      "hanzi": "我昨天很忙。",
      "pinyin": "Wǒ zuótiān hěn máng.",
      "french": "J'étais occupé hier.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #344850",
      "source": "tatoeba"
    },
    {
      "hanzi": "我们昨天发出了邀请。",
      "pinyin": "Wǒmen zuótiān fāchū le yāoqǐng.",
      "french": "Nous avons envoyé les invitations hier.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334861",
      "source": "tatoeba"
    }
  ],
  "坐": [
    {
      "hanzi": "你坐火车去吗？",
      "pinyin": "Nǐ zuò huǒchē qù ma?",
      "french": "Tu prends le train ?",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #399588",
      "source": "tatoeba"
    },
    {
      "hanzi": "我坐在他旁边。",
      "pinyin": "Wǒ zuò zài tā pángbiān.",
      "french": "Je me suis assis à côté de lui.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #334889",
      "source": "tatoeba"
    },
    {
      "hanzi": "她在一棵树下坐着。",
      "pinyin": "Tā zài yì kē shù xià zuòzhe.",
      "french": "Elle était assise sous un arbre.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #332962",
      "source": "tatoeba"
    }
  ],
  "做": [
    {
      "hanzi": "我不想再做了。",
      "pinyin": "Wǒ bù xiǎng zài zuò le.",
      "french": "Je ne veux pas le refaire.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Tatoeba #9453411",
      "source": "tatoeba"
    },
    {
      "hanzi": "你有时间再做吧。",
      "pinyin": "Nǐ yǒu shíjiān zài zuò ba.",
      "french": "Fais-le quand tu auras du temps.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #334400",
      "source": "tatoeba"
    },
    {
      "hanzi": "我们应该做到最好。",
      "pinyin": "Wǒmen yīnggāi zuòdào zuì hǎo.",
      "french": "Nous devons faire de notre mieux.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #334642",
      "source": "tatoeba"
    }
  ],
  "小": [
    {
      "hanzi": "我的家很小。",
      "pinyin": "Wǒ de jiā hěn xiǎo.",
      "french": "Ma maison est petite.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "有一个小问题。",
      "pinyin": "Yǒu yí ge xiǎo wèntí.",
      "french": "Il y a un petit problème.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Tatoeba #10740689",
      "source": "tatoeba"
    },
    {
      "hanzi": "世界很小。",
      "pinyin": "Shìjiè hěn xiǎo.",
      "french": "Le monde est petit.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Tatoeba #441475",
      "source": "tatoeba"
    }
  ],
  "饭馆": [
    {
      "hanzi": "这个饭馆很大。",
      "pinyin": "Zhège fànguǎn hěn dà.",
      "french": "Ce restaurant est grand.",
      "levelTier": "Débutant",
      "levelNumber": 1,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "我们去饭馆吃饭。",
      "pinyin": "Wǒmen qù fànguǎn chīfàn.",
      "french": "Nous allons manger au restaurant.",
      "levelTier": "Intermédiaire",
      "levelNumber": 2,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    },
    {
      "hanzi": "饭馆里有很多人。",
      "pinyin": "Fànguǎn li yǒu hěn duō rén.",
      "french": "Il y a beaucoup de monde dans le restaurant.",
      "levelTier": "Avancé",
      "levelNumber": 3,
      "contextNote": "Création ChinoisLingo — validée par Espoir Chinois",
      "source": "generated"
    }
  ]
};
