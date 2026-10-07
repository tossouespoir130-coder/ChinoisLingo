import type { TatoebaSentencePair } from './tatoebaCorpus';

/**
 * Phrases d'exemple du vocabulaire HSK 2, issues de Tatoeba (tatoeba.org, licence
 * CC BY 2.0 FR) avec la traduction française liée par ses contributeurs, contrôlées
 * mot pour mot contre l'export officiel (octobre 2026). Jusqu'à trois phrases par mot,
 * classées de la plus facile à la plus difficile ; pinyin relu à la main.
 * Même méthode que exemplesHsk1Tatoeba.ts : quand Tatoeba ne fournit pas trois
 * phrases simples, des phrases créées par ChinoisLingo et validées par Espoir
 * Chinois complètent la liste (source 'generated', mention dans contextNote).
 */
export const exemplesHsk2Tatoeba: Record<string, TatoebaSentencePair[]> = {
  '吧': [
    { hanzi: '走吧。', pinyin: 'Zǒu ba.', french: 'Allons-y !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #334277', source: 'tatoeba' },
    { hanzi: '跟我们一起吃吧。', pinyin: 'Gēn wǒmen yìqǐ chī ba.', french: 'Mange avec nous !', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #9466905', source: 'tatoeba' },
    { hanzi: '咱们吃个西瓜吧！', pinyin: 'Zánmen chī ge xīguā ba!', french: 'Mangeons une pastèque !', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #421379', source: 'tatoeba' },
  ],
  '白': [
    { hanzi: '这只猫是白的。', pinyin: 'Zhè zhī māo shì bái de.', french: 'Ce chat est blanc.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '我的衣服是白的。', pinyin: 'Wǒ de yīfu shì bái de.', french: 'Mes vêtements sont blancs.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '她的皮肤白得像雪。', pinyin: 'Tā de pífū bái de xiàng xuě.', french: 'Sa peau est aussi blanche que la neige.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #1353898', source: 'tatoeba' },
  ],
  '百': [
    { hanzi: '这本书一百块。', pinyin: 'Zhè běn shū yìbǎi kuài.', french: 'Ce livre coûte cent yuans.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '一百年叫做一个世纪。', pinyin: 'Yìbǎi nián jiàozuò yí ge shìjì.', french: 'Une centaine d\'années est appelée un siècle.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #461264', source: 'tatoeba' },
    { hanzi: '我不喜欢五百页以上的书。', pinyin: 'Wǒ bù xǐhuan wǔ bǎi yè yǐshàng de shū.', french: 'Je n\'aime pas les livres de plus de cinq cents pages.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #8792133', source: 'tatoeba' },
  ],
  '帮助': [
    { hanzi: '他叫那个男人帮助他。', pinyin: 'Tā jiào nàge nánrén bāngzhù tā.', french: 'Il a demandé à l\'homme de l\'aider.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1358685', source: 'tatoeba' },
    { hanzi: '她需要帮助。', pinyin: 'Tā xūyào bāngzhù.', french: 'Elle a besoin d\'aide.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #444622', source: 'tatoeba' },
    { hanzi: '没有他的帮助，我会失败。', pinyin: 'Méiyǒu tā de bāngzhù, wǒ huì shībài.', french: 'Sans son aide j\'aurais échoué.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #461505', source: 'tatoeba' },
  ],
  '报纸': [
    { hanzi: '我不太看报纸。', pinyin: 'Wǒ bú tài kàn bàozhǐ.', french: 'Je ne lis pas trop les journaux.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #334407', source: 'tatoeba' },
    { hanzi: '请把报纸拿来给我。', pinyin: 'Qǐng bǎ bàozhǐ nálai gěi wǒ.', french: 'Veuillez m\'apporter le journal.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #1314213', source: 'tatoeba' },
    { hanzi: '你看过今天的报纸了吗？', pinyin: 'Nǐ kànguo jīntiān de bàozhǐ le ma?', french: 'As-tu lu le journal d\'aujourd\'hui ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #840561', source: 'tatoeba' },
  ],
  '比': [
    { hanzi: '他比她大三岁。', pinyin: 'Tā bǐ tā dà sān suì.', french: 'Il a 3 ans de plus qu\'elle.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1891664', source: 'tatoeba' },
    { hanzi: '我比你矮。', pinyin: 'Wǒ bǐ nǐ ǎi.', french: 'Je suis plus petit que toi.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #916624', source: 'tatoeba' },
    { hanzi: '他比任何人都好。', pinyin: 'Tā bǐ rènhé rén dōu hǎo.', french: 'Il est mieux que quiconque.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #791345', source: 'tatoeba' },
  ],
  '便宜': [
    { hanzi: '这个苹果很便宜。', pinyin: 'Zhège píngguǒ hěn piányi.', french: 'Cette pomme n\'est pas chère.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '很便宜，是吗？', pinyin: 'Hěn piányi, shì ma?', french: 'C\'est bon marché, n\'est-ce pas ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #804972', source: 'tatoeba' },
    { hanzi: '九点以后打电话更便宜吗？', pinyin: 'Jiǔ diǎn yǐhòu dǎ diànhuà gèng piányi ma?', french: 'Est-ce que c\'est moins cher d\'appeler après 9h ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #13119414', source: 'tatoeba' },
  ],
  '别': [
    { hanzi: '别吃太多。', pinyin: 'Bié chī tài duō.', french: 'Ne mange pas trop.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10570094', source: 'tatoeba' },
    { hanzi: '请您别迟到。', pinyin: 'Qǐng nín bié chídào.', french: 'Ne soyez pas en retard, s\'il vous plaît.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #9631904', source: 'tatoeba' },
    { hanzi: '我最好别吃那个。', pinyin: 'Wǒ zuìhǎo bié chī nàge.', french: 'Je ferais mieux de ne pas manger ça.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #444794', source: 'tatoeba' },
  ],
  '唱歌': [
    { hanzi: '我想唱歌。', pinyin: 'Wǒ xiǎng chànggē.', french: 'J\'ai envie de chanter.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #510755', source: 'tatoeba' },
    { hanzi: '他一边唱歌一边工作。', pinyin: 'Tā yìbiān chànggē yìbiān gōngzuò.', french: 'Il chanta en travaillant.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #1454456', source: 'tatoeba' },
    { hanzi: '你从没听过她在台上唱歌吗？', pinyin: 'Nǐ cóng méi tīngguo tā zài táishang chànggē ma?', french: 'L\'as-tu jamais entendue chanter sur scène ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #1335403', source: 'tatoeba' },
  ],
  '出': [
    { hanzi: '他现在出去了。', pinyin: 'Tā xiànzài chūqu le.', french: 'Il est actuellement sorti.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #335030', source: 'tatoeba' },
    { hanzi: '我出去一会儿。', pinyin: 'Wǒ chūqu yíhuìr.', french: 'Je sors un moment.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #389427', source: 'tatoeba' },
    { hanzi: '你要出去散步吗？', pinyin: 'Nǐ yào chūqu sànbù ma?', french: 'Aimerais-tu aller en promenade ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9453423', source: 'tatoeba' },
  ],
  '穿': [
    { hanzi: '请穿衣服。', pinyin: 'Qǐng chuān yīfu.', french: 'Habillez-vous, s\'il vous plaît.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #819702', source: 'tatoeba' },
    { hanzi: '她穿着高跟鞋。', pinyin: 'Tā chuānzhe gāogēnxié.', french: 'Elle porte des talons hauts.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #6142002', source: 'tatoeba' },
    { hanzi: '她穿得像个演员。', pinyin: 'Tā chuān de xiàng ge yǎnyuán.', french: 'Elle s\'habillait comme une actrice.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #469477', source: 'tatoeba' },
  ],
  '船': [
    { hanzi: '我们坐船去。', pinyin: 'Wǒmen zuò chuán qù.', french: 'Nous y allons en bateau.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '他买我的船。', pinyin: 'Tā mǎi wǒ de chuán.', french: 'Il achète mon bateau.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #9408595', source: 'tatoeba' },
    { hanzi: '你可以坐船去那。', pinyin: 'Nǐ kěyǐ zuò chuán qù nà.', french: 'Tu peux y aller en bateau.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #332753', source: 'tatoeba' },
  ],
  '次': [
    { hanzi: '下次做好点。', pinyin: 'Xià cì zuò hǎo diǎn.', french: 'Fais mieux la prochaine fois.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #711627', source: 'tatoeba' },
    { hanzi: '我记得第一次。', pinyin: 'Wǒ jìde dìyī cì.', french: 'Je me souviens de la première fois.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #794229', source: 'tatoeba' },
    { hanzi: '我每次读这本书都会有新发现。', pinyin: 'Wǒ měi cì dú zhè běn shū dōu huì yǒu xīn fāxiàn.', french: 'Chaque fois que je lis ce livre, je trouve quelque chose de nouveau.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #575563', source: 'tatoeba' },
  ],
  '从': [
    { hanzi: '我是从中国来的。', pinyin: 'Wǒ shì cóng Zhōngguó lái de.', french: 'Je viens de Chine.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #717391', source: 'tatoeba' },
    { hanzi: '你是从哪个国家来的？', pinyin: 'Nǐ shì cóng nǎge guójiā lái de?', french: 'De quel pays viens-tu ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #75', source: 'tatoeba' },
    { hanzi: '从窗户可以看见高楼。', pinyin: 'Cóng chuānghu kěyǐ kànjiàn gāolóu.', french: 'On peut voir le grand bâtiment depuis la fenêtre.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #334202', source: 'tatoeba' },
  ],
  '错': [
    { hanzi: '这不是我们的错。', pinyin: 'Zhè bú shì wǒmen de cuò.', french: 'Ce n\'est pas notre faute.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #9415366', source: 'tatoeba' },
    { hanzi: '我拿错了他的伞。', pinyin: 'Wǒ ná cuò le tā de sǎn.', french: 'J\'ai pris son parapluie par erreur.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #441464', source: 'tatoeba' },
    { hanzi: '她坚持认为那是我的错。', pinyin: 'Tā jiānchí rènwéi nà shì wǒ de cuò.', french: 'Elle insistait sur le fait que c\'était ma faute.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #333503', source: 'tatoeba' },
  ],
  '打篮球': [
    { hanzi: '我喜欢打篮球。', pinyin: 'Wǒ xǐhuan dǎ lánqiú.', french: 'J\'aime jouer au basket.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '他不打篮球。', pinyin: 'Tā bù dǎ lánqiú.', french: 'Il ne joue pas au basket.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #9982223', source: 'tatoeba' },
    { hanzi: '我们下午去打篮球吧。', pinyin: 'Wǒmen xiàwǔ qù dǎ lánqiú ba.', french: 'Allons jouer au basket cet après-midi.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '大家': [
    { hanzi: '大家好。', pinyin: 'Dàjiā hǎo.', french: 'Bonjour tout le monde.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #338827', source: 'tatoeba' },
    { hanzi: '请大家看看黑板。', pinyin: 'Qǐng dàjiā kànkan hēibǎn.', french: 'Veuillez regarder le tableau, tous.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #402290', source: 'tatoeba' },
    { hanzi: '大家都同意你。', pinyin: 'Dàjiā dōu tóngyì nǐ.', french: 'Tout le monde est d\'accord avec toi.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #414403', source: 'tatoeba' },
  ],
  '但是': [
    { hanzi: '但是，我没有钱。', pinyin: 'Dànshì, wǒ méiyǒu qián.', french: 'Mais je n’ai pas d’argent.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #340150', source: 'tatoeba' },
    { hanzi: '能听懂一点儿，但是不会讲。', pinyin: 'Néng tīngdǒng yìdiǎnr, dànshì bú huì jiǎng.', french: 'Je comprends un petit peu, mais je ne sais pas le parler.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #374898', source: 'tatoeba' },
    { hanzi: '他确实很穷，但是他很幸福。', pinyin: 'Tā quèshí hěn qióng, dànshì tā hěn xìngfú.', french: 'C\'est sûr, il est pauvre, mais il est heureux.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #512448', source: 'tatoeba' },
  ],
  '到': [
    { hanzi: '她一到，我们就开始。', pinyin: 'Tā yí dào, wǒmen jiù kāishǐ.', french: 'Dès qu\'elle arrivera, nous commencerons.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #332808', source: 'tatoeba' },
    { hanzi: '现在他应该已经到了。', pinyin: 'Xiànzài tā yīnggāi yǐjīng dào le.', french: 'Il devrait déjà être arrivé maintenant.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #333107', source: 'tatoeba' },
    { hanzi: '我收到了您的信。', pinyin: 'Wǒ shōudào le nín de xìn.', french: 'J\'ai reçu votre lettre.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #334694', source: 'tatoeba' },
  ],
  '得': [
    { hanzi: '做得很好。', pinyin: 'Zuò de hěn hǎo.', french: 'Bravo !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1776598', source: 'tatoeba' },
    { hanzi: '你走得好快啊！', pinyin: 'Nǐ zǒu de hǎo kuài a!', french: 'Qu\'est-ce que tu marches vite !', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #791699', source: 'tatoeba' },
    { hanzi: '他们生活得很幸福。', pinyin: 'Tāmen shēnghuó de hěn xìngfú.', french: 'Ils vécurent une vie heureuse.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #332759', source: 'tatoeba' },
  ],
  '弟弟': [
    { hanzi: '我弟弟在看电视。', pinyin: 'Wǒ dìdi zài kàn diànshì.', french: 'Mon petit frère regarde la télé.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #502869', source: 'tatoeba' },
    { hanzi: '我弟弟和我一样高。', pinyin: 'Wǒ dìdi hé wǒ yíyàng gāo.', french: 'Mon frère est aussi grand que moi.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #390485', source: 'tatoeba' },
    { hanzi: '我弟弟的房间总是很乱。', pinyin: 'Wǒ dìdi de fángjiān zǒngshì hěn luàn.', french: 'La chambre de mon frère est toujours en désordre.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #405132', source: 'tatoeba' },
  ],
  '第一': [
    { hanzi: '这是第一次。', pinyin: 'Zhè shì dìyī cì.', french: 'C\'est la première fois.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1227135', source: 'tatoeba' },
    { hanzi: '我记得第一次。', pinyin: 'Wǒ jìde dìyī cì.', french: 'Je me souviens de la première fois.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #794229', source: 'tatoeba' },
    { hanzi: '他是第一个来的。', pinyin: 'Tā shì dìyī ge lái de.', french: 'Il est le premier arrivé.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '懂': [
    { hanzi: '我不懂。', pinyin: 'Wǒ bù dǒng.', french: 'Je ne comprends pas.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #409679', source: 'tatoeba' },
    { hanzi: '我不懂音乐。', pinyin: 'Wǒ bù dǒng yīnyuè.', french: 'Je ne comprends pas la musique.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #472864', source: 'tatoeba' },
    { hanzi: '我听不懂他的笑话。', pinyin: 'Wǒ tīng bu dǒng tā de xiàohuà.', french: 'Je ne comprends pas sa blague.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #692045', source: 'tatoeba' },
  ],
  '房间': [
    { hanzi: '谁在这房间里？', pinyin: 'Shéi zài zhè fángjiān li?', french: 'Qui est dans cette pièce ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #465035', source: 'tatoeba' },
    { hanzi: '我不用打扫房间。', pinyin: 'Wǒ bú yòng dǎsǎo fángjiān.', french: 'Je n\'ai pas à nettoyer ma chambre.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #472868', source: 'tatoeba' },
    { hanzi: '请给我房间钥匙。', pinyin: 'Qǐng gěi wǒ fángjiān yàoshi.', french: 'La clef de la chambre, s\'il vous plaît.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #782891', source: 'tatoeba' },
  ],
  '非常': [
    { hanzi: '她非常漂亮。', pinyin: 'Tā fēicháng piàoliang.', french: 'Elle est très belle.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #408845', source: 'tatoeba' },
    { hanzi: '我非常饿。', pinyin: 'Wǒ fēicháng è.', french: 'J\'ai très faim.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #2357636', source: 'tatoeba' },
    { hanzi: '她非常像她的母亲。', pinyin: 'Tā fēicháng xiàng tā de mǔqīn.', french: 'Elle ressemble beaucoup à sa mère.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #465002', source: 'tatoeba' },
  ],
  '服务员': [
    { hanzi: '我叫服务员。', pinyin: 'Wǒ jiào fúwùyuán.', french: 'J\'appelle le garçon.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #12262381', source: 'tatoeba' },
    { hanzi: '服务员，我要一杯茶。', pinyin: 'Fúwùyuán, wǒ yào yì bēi chá.', french: 'Serveur, je voudrais un thé.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '她是饭馆的服务员。', pinyin: 'Tā shì fànguǎn de fúwùyuán.', french: 'Elle est serveuse au restaurant.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '高': [
    { hanzi: '她很高。', pinyin: 'Tā hěn gāo.', french: 'Elle est grande.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #13964237', source: 'tatoeba' },
    { hanzi: '他又高又胖，还总是很忙。', pinyin: 'Tā yòu gāo yòu pàng, hái zǒngshì hěn máng.', french: 'Il est grand, gros, et toujours occupé.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #333972', source: 'tatoeba' },
    { hanzi: '他是班上个子最高的。', pinyin: 'Tā shì bān shang gèzi zuì gāo de.', french: 'Il est le plus grand de la classe.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #2383164', source: 'tatoeba' },
  ],
  '告诉': [
    { hanzi: '不要告诉她。', pinyin: 'Bú yào gàosu tā.', french: 'Ne lui dis pas.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10733173', source: 'tatoeba' },
    { hanzi: '告诉我她为什么哭。', pinyin: 'Gàosu wǒ tā wèishénme kū.', french: 'Dis-moi pourquoi elle pleure.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #399266', source: 'tatoeba' },
    { hanzi: '告诉我正确的答案。', pinyin: 'Gàosu wǒ zhèngquè de dá\'àn.', french: 'Dis-moi la bonne réponse.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #792818', source: 'tatoeba' },
  ],
  '哥哥': [
    { hanzi: '我有个哥哥。', pinyin: 'Wǒ yǒu ge gēge.', french: 'J\'ai un frère.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #679442', source: 'tatoeba' },
    { hanzi: '我哥哥喜欢音乐。', pinyin: 'Wǒ gēge xǐhuan yīnyuè.', french: 'Mon grand frère aime la musique.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #343955', source: 'tatoeba' },
    { hanzi: '他没他哥哥聪明。', pinyin: 'Tā méi tā gēge cōngming.', french: 'Il est moins intelligent que son grand frère.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #811281', source: 'tatoeba' },
  ],
  '给': [
    { hanzi: '我给了你一本书。', pinyin: 'Wǒ gěi le nǐ yì běn shū.', french: 'Je t\'ai donné un livre.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #335126', source: 'tatoeba' },
    { hanzi: '爷爷买给我的！', pinyin: 'Yéye mǎi gěi wǒ de!', french: 'Grand-père me l\'a acheté !', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #334262', source: 'tatoeba' },
    { hanzi: '我叔叔给了我一份礼物。', pinyin: 'Wǒ shūshu gěi le wǒ yí fèn lǐwù.', french: 'Mon oncle m\'a donné un cadeau.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #334104', source: 'tatoeba' },
  ],
  '公共汽车': [
    { hanzi: '公共汽车来了。', pinyin: 'Gōnggòng qìchē lái le.', french: 'Le bus arrive.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '我坐公共汽车去学校。', pinyin: 'Wǒ zuò gōnggòng qìchē qù xuéxiào.', french: 'Je vais à l\'école en bus.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '坐公共汽车要多长时间？', pinyin: 'Zuò gōnggòng qìchē yào duō cháng shíjiān?', french: 'Combien de temps faut-il en bus ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '公斤': [
    { hanzi: '他七十公斤。', pinyin: 'Tā qīshí gōngjīn.', french: 'Il pèse soixante-dix kilos.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '我想买两公斤苹果。', pinyin: 'Wǒ xiǎng mǎi liǎng gōngjīn píngguǒ.', french: 'Je voudrais acheter deux kilos de pommes.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '香蕉多少钱一公斤？', pinyin: 'Xiāngjiāo duōshao qián yì gōngjīn?', french: 'Combien coûte un kilo de bananes ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #13539442', source: 'tatoeba' },
  ],
  '公司': [
    { hanzi: '他在哪家公司工作？', pinyin: 'Tā zài nǎ jiā gōngsī gōngzuò?', french: 'Où est son lieu de travail ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #336041', source: 'tatoeba' },
    { hanzi: '是什么让您决定为我们公司工作？', pinyin: 'Shì shénme ràng nín juédìng wèi wǒmen gōngsī gōngzuò?', french: 'Qu\'est-ce qui vous a décidé à travailler pour notre société ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #472816', source: 'tatoeba' },
    { hanzi: '他使公司成为今天的样子。', pinyin: 'Tā shǐ gōngsī chéngwéi jīntiān de yàngzi.', french: 'Il a fait de la société ce qu\'elle est aujourd\'hui.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #1323981', source: 'tatoeba' },
  ],
  '贵': [
    { hanzi: '太贵了！', pinyin: 'Tài guì le!', french: 'C\'est trop cher !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #399956', source: 'tatoeba' },
    { hanzi: '这个不贵。', pinyin: 'Zhège bú guì.', french: 'Ce n\'est pas cher.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #924018', source: 'tatoeba' },
    { hanzi: '这不会很贵。', pinyin: 'Zhè bú huì hěn guì.', french: 'Ça ne va pas coûter grand-chose.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #2879811', source: 'tatoeba' },
  ],
  '还': [
    { hanzi: '我还没吃。', pinyin: 'Wǒ hái méi chī.', french: 'Je n\'ai pas encore mangé.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #420110', source: 'tatoeba' },
    { hanzi: '我还饿着呢。', pinyin: 'Wǒ hái èzhe ne.', french: 'J\'ai encore faim.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #5091106', source: 'tatoeba' },
    { hanzi: '我的衬衫还没干。', pinyin: 'Wǒ de chènshān hái méi gān.', french: 'Ma chemise n\'est pas encore sèche.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #10182717', source: 'tatoeba' },
  ],
  '孩子': [
    { hanzi: '我有两个孩子。', pinyin: 'Wǒ yǒu liǎng ge háizi.', french: 'J\'ai deux enfants.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #677470', source: 'tatoeba' },
    { hanzi: '她照顾孩子们。', pinyin: 'Tā zhàogu háizimen.', french: 'Elle prend soin des enfants.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #836377', source: 'tatoeba' },
    { hanzi: '母亲很担心孩子。', pinyin: 'Mǔqīn hěn dānxīn háizi.', french: 'Mère était inquiète à propos des enfants.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #333333', source: 'tatoeba' },
  ],
  '好吃': [
    { hanzi: '这个菜很好吃。', pinyin: 'Zhège cài hěn hǎochī.', french: 'Ce plat est délicieux.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '妈妈做的饭很好吃。', pinyin: 'Māma zuò de fàn hěn hǎochī.', french: 'La cuisine de maman est délicieuse.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '这家饭馆的鱼非常好吃。', pinyin: 'Zhè jiā fànguǎn de yú fēicháng hǎochī.', french: 'Le poisson de ce restaurant est excellent.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '号': [
    { hanzi: '今天是几号？', pinyin: 'Jīntiān shì jǐ hào?', french: 'Quelle est la date aujourd\'hui ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #408909', source: 'tatoeba' },
    { hanzi: '你的生日是几月几号？', pinyin: 'Nǐ de shēngrì shì jǐ yuè jǐ hào?', french: 'Quand ton anniversaire a-t-il lieu ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #382981', source: 'tatoeba' },
    { hanzi: '我的房间号是多少？', pinyin: 'Wǒ de fángjiān hào shì duōshao?', french: 'Quel est le numéro de ma chambre ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #332881', source: 'tatoeba' },
  ],
  '黑': [
    { hanzi: '天黑了。', pinyin: 'Tiān hēi le.', french: 'Il fait nuit.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '我的狗是黑的。', pinyin: 'Wǒ de gǒu shì hēi de.', french: 'Mon chien est noir.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '我有只大黑狗。', pinyin: 'Wǒ yǒu zhī dà hēi gǒu.', french: 'J\'ai un grand chien noir.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #11679682', source: 'tatoeba' },
  ],
  '红': [
    { hanzi: '我有两条红鱼。', pinyin: 'Wǒ yǒu liǎng tiáo hóng yú.', french: 'J\'ai deux poissons rouges.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10369277', source: 'tatoeba' },
    { hanzi: '这只苹果非常红。', pinyin: 'Zhè zhī píngguǒ fēicháng hóng.', french: 'Cette pomme est très rouge.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #745929', source: 'tatoeba' },
    { hanzi: '她脸红了。', pinyin: 'Tā liǎn hóng le.', french: 'Elle rougit.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #396112', source: 'tatoeba' },
  ],
  '欢迎': [
    { hanzi: '欢迎。', pinyin: 'Huānyíng.', french: 'Bienvenue !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #343770', source: 'tatoeba' },
    { hanzi: '欢迎来到我们家！', pinyin: 'Huānyíng láidào wǒmen jiā!', french: 'Bienvenue dans notre maison !', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #469438', source: 'tatoeba' },
    { hanzi: '不管你们去哪儿，都会受到欢迎。', pinyin: 'Bùguǎn nǐmen qù nǎr, dōu huì shòudào huānyíng.', french: 'Où que vous alliez, vous serez bienvenus.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #471306', source: 'tatoeba' },
  ],
  '回答': [
    { hanzi: '你回答了什么？', pinyin: 'Nǐ huídá le shénme?', french: 'Qu\'est-ce que tu as répondu ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #335067', source: 'tatoeba' },
    { hanzi: '这个问题很难回答。', pinyin: 'Zhège wèntí hěn nán huídá.', french: 'Il est difficile de répondre à cette question.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #617747', source: 'tatoeba' },
    { hanzi: '我需要回答所有问题吗？', pinyin: 'Wǒ xūyào huídá suǒyǒu wèntí ma?', french: 'Dois-je répondre à toutes les questions ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #5728711', source: 'tatoeba' },
  ],
  '机场': [
    { hanzi: '我现在在机场。', pinyin: 'Wǒ xiànzài zài jīchǎng.', french: 'Je suis maintenant à l\'aéroport.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #794232', source: 'tatoeba' },
    { hanzi: '我们几点去机场？', pinyin: 'Wǒmen jǐ diǎn qù jīchǎng?', french: 'À quelle heure allons-nous à l\'aéroport ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '我去了机场送一个朋友。', pinyin: 'Wǒ qù le jīchǎng sòng yí ge péngyou.', french: 'Je suis allé à l\'aéroport accompagner un ami qui partait.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #346724', source: 'tatoeba' },
  ],
  '鸡蛋': [
    { hanzi: '我早上吃两个鸡蛋。', pinyin: 'Wǒ zǎoshang chī liǎng ge jīdàn.', french: 'Le matin, je mange deux œufs.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '请问鸡蛋在哪里？', pinyin: 'Qǐngwèn jīdàn zài nǎlǐ?', french: 'S\'il vous plaît, où sont les œufs ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #334425', source: 'tatoeba' },
    { hanzi: '既然你要去超市，那就顺便买些鸡蛋吧。', pinyin: 'Jìrán nǐ yào qù chāoshì, nà jiù shùnbiàn mǎi xiē jīdàn ba.', french: 'Comme tu vas au supermarché, profites-en pour acheter des œufs.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #406186', source: 'tatoeba' },
  ],
  '件': [
    { hanzi: '妈妈给我做了件新衣服。', pinyin: 'Māma gěi wǒ zuò le jiàn xīn yīfu.', french: 'Maman a confectionné un nouveau vêtement.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #408268', source: 'tatoeba' },
    { hanzi: '我叔叔送给他一件礼物。', pinyin: 'Wǒ shūshu sòng gěi tā yí jiàn lǐwù.', french: 'Mon oncle lui a offert un cadeau.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #636209', source: 'tatoeba' },
    { hanzi: '我想送一件礼物给他过生日。', pinyin: 'Wǒ xiǎng sòng yí jiàn lǐwù gěi tā guò shēngrì.', french: 'Je voudrais lui offrir un cadeau pour son anniversaire.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #501720', source: 'tatoeba' },
  ],
  '教室': [
    { hanzi: '教室里没有人。', pinyin: 'Jiàoshì li méiyǒu rén.', french: 'Il n\'y a personne dans la salle.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #465918', source: 'tatoeba' },
    { hanzi: '学生们在教室里。', pinyin: 'Xuéshengmen zài jiàoshì li.', french: 'Les élèves sont dans la salle de classe.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '你们昨天为什么离开教室？', pinyin: 'Nǐmen zuótiān wèishénme líkāi jiàoshì?', french: 'Pourquoi vous êtes-vous absentées de la classe hier ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #471332', source: 'tatoeba' },
  ],
  '介绍': [
    { hanzi: '我来介绍一下，这是我朋友。', pinyin: 'Wǒ lái jièshào yíxià, zhè shì wǒ péngyou.', french: 'Je vous présente : voici mon ami.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '请你把我介绍给她。', pinyin: 'Qǐng nǐ bǎ wǒ jièshào gěi tā.', french: 'Je te prie de me présenter à elle.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #808211', source: 'tatoeba' },
    { hanzi: '我上个星期把她介绍给你了。', pinyin: 'Wǒ shàng ge xīngqī bǎ tā jièshào gěi nǐ le.', french: 'Je te l\'ai présentée la semaine dernière.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #939345', source: 'tatoeba' },
  ],
  '姐姐': [
    { hanzi: '她是我的姐姐。', pinyin: 'Tā shì wǒ de jiějie.', french: 'C\'est ma sœur aînée.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #469258', source: 'tatoeba' },
    { hanzi: '我姐姐游泳很快。', pinyin: 'Wǒ jiějie yóuyǒng hěn kuài.', french: 'Ma grande sœur nage très vite.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #345960', source: 'tatoeba' },
    { hanzi: '我的裙子比我姐姐多。', pinyin: 'Wǒ de qúnzi bǐ wǒ jiějie duō.', french: 'J\'ai plus de robes que ma sœur.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #1895536', source: 'tatoeba' },
  ],
  '近': [
    { hanzi: '我的家离学校很近。', pinyin: 'Wǒ de jiā lí xuéxiào hěn jìn.', french: 'Ma maison est près de l\'école.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #554425', source: 'tatoeba' },
    { hanzi: '我们学校离公园非常近。', pinyin: 'Wǒmen xuéxiào lí gōngyuán fēicháng jìn.', french: 'Notre école est très proche du parc.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #408485', source: 'tatoeba' },
    { hanzi: '别走近那只狗。', pinyin: 'Bié zǒu jìn nà zhī gǒu.', french: 'N\'approchez pas du chien.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #350680', source: 'tatoeba' },
  ],
  '进': [
    { hanzi: '进来！', pinyin: 'Jìnlai!', french: 'Entrez !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #348106', source: 'tatoeba' },
    { hanzi: '跟我进房间。', pinyin: 'Gēn wǒ jìn fángjiān.', french: 'Entre dans la chambre après moi.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #444694', source: 'tatoeba' },
    { hanzi: '他们不会允许我们进花园的。', pinyin: 'Tāmen bú huì yǔnxǔ wǒmen jìn huāyuán de.', french: 'Ils ne nous autoriseront pas à entrer dans le jardin.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #785985', source: 'tatoeba' },
  ],
  '就': [
    { hanzi: '我马上就来。', pinyin: 'Wǒ mǎshàng jiù lái.', french: 'J\'arrive tout de suite.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #710733', source: 'tatoeba' },
    { hanzi: '你能来就来！', pinyin: 'Nǐ néng lái jiù lái!', french: 'Viens si tu peux !', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #804811', source: 'tatoeba' },
    { hanzi: '如果我们不吃，就会死。', pinyin: 'Rúguǒ wǒmen bù chī, jiù huì sǐ.', french: 'Si on ne mange pas, on meurt.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #334449', source: 'tatoeba' },
  ],
  '觉得': [
    { hanzi: '我觉得很热。', pinyin: 'Wǒ juéde hěn rè.', french: 'J\'ai chaud.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #489080', source: 'tatoeba' },
    { hanzi: '我不觉得她像她妈妈。', pinyin: 'Wǒ bù juéde tā xiàng tā māma.', french: 'Je ne pense pas qu\'elle ressemble à sa mère.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #333833', source: 'tatoeba' },
    { hanzi: '我觉得最好别试。', pinyin: 'Wǒ juéde zuìhǎo bié shì.', french: 'Je pense qu\'il vaut mieux ne pas essayer.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #363901', source: 'tatoeba' },
  ],
  '咖啡': [
    { hanzi: '您想要咖啡吗？', pinyin: 'Nín xiǎngyào kāfēi ma?', french: 'Voulez-vous du café ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1753085', source: 'tatoeba' },
    { hanzi: '您想要茶还是咖啡？', pinyin: 'Nín xiǎngyào chá háishi kāfēi?', french: 'Préféreriez-vous un thé ou un café ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #335008', source: 'tatoeba' },
    { hanzi: '我不习惯喝无糖咖啡。', pinyin: 'Wǒ bù xíguàn hē wútáng kāfēi.', french: 'Je n\'ai pas l\'habitude de boire du café sans sucre.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #799299', source: 'tatoeba' },
  ],
  '开始': [
    { hanzi: '电影什么时候开始？', pinyin: 'Diànyǐng shénme shíhou kāishǐ?', french: 'Quand est-ce que le film commence ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #918096', source: 'tatoeba' },
    { hanzi: '你必须马上开始。', pinyin: 'Nǐ bìxū mǎshàng kāishǐ.', french: 'Tu dois commencer sur-le-champ.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #333008', source: 'tatoeba' },
    { hanzi: '他开始掉头发了。', pinyin: 'Tā kāishǐ diào tóufa le.', french: 'Il commence à perdre ses cheveux.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #791594', source: 'tatoeba' },
  ],
  '考试': [
    { hanzi: '考试难吗？', pinyin: 'Kǎoshì nán ma?', french: 'Est-ce que l\'examen est difficile ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10276227', source: 'tatoeba' },
    { hanzi: '考试很简单。', pinyin: 'Kǎoshì hěn jiǎndān.', french: 'L\'examen est facile.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #10573655', source: 'tatoeba' },
    { hanzi: '好好努力，你就能通过考试。', pinyin: 'Hǎohǎo nǔlì, nǐ jiù néng tōngguò kǎoshì.', french: 'Travaille dur, et tu réussiras ton examen.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #334668', source: 'tatoeba' },
  ],
  '可能': [
    { hanzi: '不可能！', pinyin: 'Bù kěnéng!', french: 'Impossible !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #503298', source: 'tatoeba' },
    { hanzi: '我可能要迟到几分钟。', pinyin: 'Wǒ kěnéng yào chídào jǐ fēnzhōng.', french: 'Je serai peut-être quelques minutes en retard.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #1550564', source: 'tatoeba' },
    { hanzi: '他很可能赢得比赛。', pinyin: 'Tā hěn kěnéng yíngdé bǐsài.', french: 'Il va probablement gagner le match.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #512507', source: 'tatoeba' },
  ],
  '可以': [
    { hanzi: '你可以慢慢来。', pinyin: 'Nǐ kěyǐ mànmàn lái.', french: 'Tu peux prendre ton temps.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #334393', source: 'tatoeba' },
    { hanzi: '我可以吃那个蛋糕吗？', pinyin: 'Wǒ kěyǐ chī nàge dàngāo ma?', french: 'Puis-je manger ce gâteau ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #472300', source: 'tatoeba' },
    { hanzi: '我可以被原谅吗？', pinyin: 'Wǒ kěyǐ bèi yuánliàng ma?', french: 'Puis-je être excusé ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #472963', source: 'tatoeba' },
  ],
  '课': [
    { hanzi: '我明天有课。', pinyin: 'Wǒ míngtiān yǒu kè.', french: 'J\'ai cours demain.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #503098', source: 'tatoeba' },
    { hanzi: '他们在上数学课。', pinyin: 'Tāmen zài shàng shùxué kè.', french: 'Ils sont en cours de mathématiques.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #2200427', source: 'tatoeba' },
    { hanzi: '我们九点上课，可是他九点一刻才来。', pinyin: 'Wǒmen jiǔ diǎn shàngkè, kěshì tā jiǔ diǎn yí kè cái lái.', french: 'Nous commençons la classe à neuf heures, mais il n\'est venu qu\'au quart.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #838505', source: 'tatoeba' },
  ],
  '快': [
    { hanzi: '快点！', pinyin: 'Kuài diǎn!', french: 'Dépêche-toi !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #409074', source: 'tatoeba' },
    { hanzi: '越快越好。', pinyin: 'Yuè kuài yuè hǎo.', french: 'Le plus tôt sera le mieux.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #335730', source: 'tatoeba' },
    { hanzi: '我希望他很快就能好起来。', pinyin: 'Wǒ xīwàng tā hěn kuài jiù néng hǎo qilai.', french: 'J\'espère qu\'il ira mieux rapidement.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #411639', source: 'tatoeba' },
  ],
  '快乐': [
    { hanzi: '生日快乐！', pinyin: 'Shēngrì kuàilè!', french: 'Bon anniversaire !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #346492', source: 'tatoeba' },
    { hanzi: '你快乐吗？', pinyin: 'Nǐ kuàilè ma?', french: 'Es-tu heureux ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #819454', source: 'tatoeba' },
    { hanzi: '你从来没有快乐过。', pinyin: 'Nǐ cónglái méiyǒu kuàilè guo.', french: 'Tu n\'as jamais été heureux.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9968824', source: 'tatoeba' },
  ],
  '累': [
    { hanzi: '我很累。', pinyin: 'Wǒ hěn lèi.', french: 'Je suis fatigué !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #397734', source: 'tatoeba' },
    { hanzi: '他很容易觉得累。', pinyin: 'Tā hěn róngyì juéde lèi.', french: 'Il se fatigue facilement.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #335106', source: 'tatoeba' },
    { hanzi: '你看起来有点累。', pinyin: 'Nǐ kàn qilai yǒudiǎn lèi.', french: 'Vous avez l\'air fatigué.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #686976', source: 'tatoeba' },
  ],
  '离': [
    { hanzi: '离这儿远吗？', pinyin: 'Lí zhèr yuǎn ma?', french: 'C\'est loin d\'ici ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #501530', source: 'tatoeba' },
    { hanzi: '椅子离门很近。', pinyin: 'Yǐzi lí mén hěn jìn.', french: 'La chaise est près de la porte.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #466163', source: 'tatoeba' },
    { hanzi: '我的国家离日本很远。', pinyin: 'Wǒ de guójiā lí Rìběn hěn yuǎn.', french: 'Mon pays est éloigné du Japon.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #683590', source: 'tatoeba' },
  ],
  '两': [
    { hanzi: '他有两只猫。', pinyin: 'Tā yǒu liǎng zhī māo.', french: 'Il a deux chats.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #482305', source: 'tatoeba' },
    { hanzi: '你有两台电脑吗？', pinyin: 'Nǐ yǒu liǎng tái diànnǎo ma?', french: 'As-tu deux ordinateurs ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #810672', source: 'tatoeba' },
    { hanzi: '我已经等了两个小时。我不能继续等了。', pinyin: 'Wǒ yǐjīng děng le liǎng ge xiǎoshí. Wǒ bù néng jìxù děng le.', french: 'J\'ai déjà attendu deux heures, je ne peux pas attendre plus.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9489485', source: 'tatoeba' },
  ],
  '路': [
    { hanzi: '我走路去。', pinyin: 'Wǒ zǒulù qù.', french: 'J\'irai à pied.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #380734', source: 'tatoeba' },
    { hanzi: '我在回家的路上遇到了他。', pinyin: 'Wǒ zài huíjiā de lùshang yùdào le tā.', french: 'Je l\'ai rencontré en rentrant chez moi.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #794156', source: 'tatoeba' },
    { hanzi: '他们住在路对面。', pinyin: 'Tāmen zhù zài lù duìmiàn.', french: 'Ils vivent de l\'autre côté de la rue.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #6103122', source: 'tatoeba' },
  ],
  '旅游': [
    { hanzi: '“我喜欢旅游。”“我也是。”', pinyin: '“Wǒ xǐhuan lǚyóu.” “Wǒ yě shì.”', french: '«J\'aime voyager.» «Moi aussi.»', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1490503', source: 'tatoeba' },
    { hanzi: '没有什么比旅游更舒服的了。', pinyin: 'Méiyǒu shénme bǐ lǚyóu gèng shūfu de le.', french: 'Rien n\'est plus agréable que de voyager.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #407283', source: 'tatoeba' },
    { hanzi: '世界就像一本书，不旅游的人只读了一页。', pinyin: 'Shìjiè jiù xiàng yì běn shū, bù lǚyóu de rén zhǐ dú le yí yè.', french: 'Le monde est comme un livre, ceux qui ne voyagent pas n\'en lisent qu\'une page.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #804867', source: 'tatoeba' },
  ],
  '卖': [
    { hanzi: '他是卖鱼的。', pinyin: 'Tā shì mài yú de.', french: 'Il est poissonnier.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10767098', source: 'tatoeba' },
    { hanzi: '你为什么卖了它？', pinyin: 'Nǐ wèishénme mài le tā?', french: 'Pourquoi l\'avez-vous vendu ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #9965600', source: 'tatoeba' },
    { hanzi: '他们只对卖书有兴趣。', pinyin: 'Tāmen zhǐ duì mài shū yǒu xìngqù.', french: 'Tout ce qui les intéressait était de vendre des livres.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #802867', source: 'tatoeba' },
  ],
  '慢': [
    { hanzi: '慢慢吃。', pinyin: 'Mànmàn chī.', french: 'Mange lentement.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10483588', source: 'tatoeba' },
    { hanzi: '请你慢点讲。', pinyin: 'Qǐng nǐ màn diǎn jiǎng.', french: 'S\'il te plaît, parle moins vite.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #514741', source: 'tatoeba' },
    { hanzi: '我适应新环境很慢。', pinyin: 'Wǒ shìyìng xīn huánjìng hěn màn.', french: 'Je suis lente à m\'adapter à de nouvelles situations.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9526055', source: 'tatoeba' },
  ],
  '忙': [
    { hanzi: '我爸爸很忙。', pinyin: 'Wǒ bàba hěn máng.', french: 'Mon père est occupé.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #332500', source: 'tatoeba' },
    { hanzi: '我最近很忙。', pinyin: 'Wǒ zuìjìn hěn máng.', french: 'Je suis très occupé ces jours-ci.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #409710', source: 'tatoeba' },
    { hanzi: '即使他很忙，他也会来的。', pinyin: 'Jíshǐ tā hěn máng, tā yě huì lái de.', french: 'Même s\'il est occupé, il viendra.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #431553', source: 'tatoeba' },
  ],
  '每': [
    { hanzi: '你每次都忘记拿钱。', pinyin: 'Nǐ měi cì dōu wàngjì ná qián.', french: 'Tu oublies toujours ton argent.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #2887904', source: 'tatoeba' },
    { hanzi: '每个孩子都收到了份礼物。', pinyin: 'Měi ge háizi dōu shōudào le fèn lǐwù.', french: 'Chaque enfant a reçu un cadeau.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #379587', source: 'tatoeba' },
    { hanzi: '每个学生都可以使用图书馆。', pinyin: 'Měi ge xuésheng dōu kěyǐ shǐyòng túshūguǎn.', french: 'Tout étudiant a accès à la bibliothèque.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #510692', source: 'tatoeba' },
  ],
  '妹妹': [
    { hanzi: '我妹妹唱歌很好听。', pinyin: 'Wǒ mèimei chànggē hěn hǎotīng.', french: 'Ma sœur chante très bien.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #346120', source: 'tatoeba' },
    { hanzi: '你妹妹多漂亮啊！', pinyin: 'Nǐ mèimei duō piàoliang a!', french: 'Comme ta sœur est jolie !', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #476520', source: 'tatoeba' },
    { hanzi: '我妹妹经常哭。', pinyin: 'Wǒ mèimei jīngcháng kū.', french: 'Ma sœur pleure souvent.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #811295', source: 'tatoeba' },
  ],
  '门': [
    { hanzi: '开门！', pinyin: 'Kāimén!', french: 'Ouvre-moi !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #862207', source: 'tatoeba' },
    { hanzi: '关门。', pinyin: 'Guānmén.', french: 'Ferme la porte.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #472970', source: 'tatoeba' },
    { hanzi: '几乎所有门都关了。', pinyin: 'Jīhū suǒyǒu mén dōu guān le.', french: 'Presque toutes les portes étaient fermées.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9584501', source: 'tatoeba' },
  ],
  '男人': [
    { hanzi: '那个男人是谁？', pinyin: 'Nàge nánrén shì shéi?', french: 'Qui est cet homme ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #493346', source: 'tatoeba' },
    { hanzi: '男人应该工作。', pinyin: 'Nánrén yīnggāi gōngzuò.', french: 'Un homme doit travailler.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #334672', source: 'tatoeba' },
    { hanzi: '我的中文老师是男人。', pinyin: 'Wǒ de Zhōngwén lǎoshī shì nánrén.', french: 'Mon professeur de chinois est un homme.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #738466', source: 'tatoeba' },
  ],
  '您': [
    { hanzi: '您住在哪里？', pinyin: 'Nín zhù zài nǎlǐ?', french: 'Où habitez-vous ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #393584', source: 'tatoeba' },
    { hanzi: '您喝绿茶吗？', pinyin: 'Nín hē lǜchá ma?', french: 'Buvez-vous du thé vert ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #8689195', source: 'tatoeba' },
    { hanzi: '我收到了您的信。', pinyin: 'Wǒ shōudào le nín de xìn.', french: 'J\'ai reçu votre lettre.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #334694', source: 'tatoeba' },
  ],
  '牛奶': [
    { hanzi: '没牛奶了。', pinyin: 'Méi niúnǎi le.', french: 'Il n\'y a plus de lait.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #345919', source: 'tatoeba' },
    { hanzi: '她总是买牛奶。', pinyin: 'Tā zǒngshì mǎi niúnǎi.', french: 'Elle achète toujours du lait.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #1328117', source: 'tatoeba' },
    { hanzi: '只剩下一点点牛奶了。', pinyin: 'Zhǐ shèngxia yìdiǎndiǎn niúnǎi le.', french: 'Il reste juste un peu de lait.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #874391', source: 'tatoeba' },
  ],
  '女人': [
    { hanzi: '我是女人。', pinyin: 'Wǒ shì nǚrén.', french: 'Je suis une femme.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #747591', source: 'tatoeba' },
    { hanzi: '女人很年轻。', pinyin: 'Nǚrén hěn niánqīng.', french: 'La femme est jeune.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #7772406', source: 'tatoeba' },
    { hanzi: '我看见那儿有个奇怪的女人。', pinyin: 'Wǒ kànjiàn nàr yǒu ge qíguài de nǚrén.', french: 'J\'ai vu une étrange femme là-bas.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #346810', source: 'tatoeba' },
  ],
  '旁边': [
    { hanzi: '她坐在我旁边。', pinyin: 'Tā zuò zài wǒ pángbiān.', french: 'Elle s\'est assise à côté de moi.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #343957', source: 'tatoeba' },
    { hanzi: '我能坐在你旁边吗？', pinyin: 'Wǒ néng zuò zài nǐ pángbiān ma?', french: 'Puis-je m\'asseoir près de toi ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #5551028', source: 'tatoeba' },
    { hanzi: '坐在我旁边的男人跟我说话了。', pinyin: 'Zuò zài wǒ pángbiān de nánrén gēn wǒ shuōhuà le.', french: 'L\'homme assis à côté de moi me parla.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #334075', source: 'tatoeba' },
  ],
  '跑步': [
    { hanzi: '我喜欢跑步。', pinyin: 'Wǒ xǐhuan pǎobù.', french: 'J\'aime courir.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #363979', source: 'tatoeba' },
    { hanzi: '你喜欢跑步吗？', pinyin: 'Nǐ xǐhuan pǎobù ma?', french: 'Aimes-tu courir ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #10334449', source: 'tatoeba' },
    { hanzi: '他每天早上跑步。', pinyin: 'Tā měitiān zǎoshang pǎobù.', french: 'Il court tous les matins.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '票': [
    { hanzi: '你有票吗？', pinyin: 'Nǐ yǒu piào ma?', french: 'As-tu un ticket ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10551867', source: 'tatoeba' },
    { hanzi: '我买了两张音乐会的票。', pinyin: 'Wǒ mǎi le liǎng zhāng yīnyuèhuì de piào.', french: 'J\'ai acheté deux billets pour le concert.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #791439', source: 'tatoeba' },
    { hanzi: '请问票在哪儿买呀？', pinyin: 'Qǐngwèn piào zài nǎr mǎi ya?', french: 'Où puis-je acheter un billet ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #12282209', source: 'tatoeba' },
  ],
  '妻子': [
    { hanzi: '她会是个好妻子的。', pinyin: 'Tā huì shì ge hǎo qīzi de.', french: 'Elle fera une bonne épouse.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #782146', source: 'tatoeba' },
    { hanzi: '你现在还爱你的妻子吗？', pinyin: 'Nǐ xiànzài hái ài nǐ de qīzi ma?', french: 'Aimes-tu encore ta femme ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #12686308', source: 'tatoeba' },
    { hanzi: '他一直会给他妻子送礼物。', pinyin: 'Tā yìzhí huì gěi tā qīzi sòng lǐwù.', french: 'Il n\'arrête pas d\'offrir des cadeaux à sa femme.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #5856905', source: 'tatoeba' },
  ],
  '起床': [
    { hanzi: '你几点起床？', pinyin: 'Nǐ jǐ diǎn qǐchuáng?', french: 'À quelle heure te lèves-tu ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #424526', source: 'tatoeba' },
    { hanzi: '我刚才起床了。', pinyin: 'Wǒ gāngcái qǐchuáng le.', french: 'Je viens de me lever.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #398497', source: 'tatoeba' },
    { hanzi: '我今天早上起床的时候，感觉有点不舒服。', pinyin: 'Wǒ jīntiān zǎoshang qǐchuáng de shíhou, gǎnjué yǒudiǎn bù shūfu.', french: 'Lorsque je me suis réveillé ce matin, je me sentais malade.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #2383166', source: 'tatoeba' },
  ],
  '千': [
    { hanzi: '她有两千本书。', pinyin: 'Tā yǒu liǎng qiān běn shū.', french: 'Elle a deux mille livres.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10610500', source: 'tatoeba' },
    { hanzi: '这是在两千年。', pinyin: 'Zhè shì zài liǎngqiān nián.', french: 'C\'était en l\'an deux mille.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #726762', source: 'tatoeba' },
    { hanzi: '这个手机三千块。', pinyin: 'Zhège shǒujī sānqiān kuài.', french: 'Ce téléphone coûte trois mille yuans.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '晴': [
    { hanzi: '今天是晴天。', pinyin: 'Jīntiān shì qíngtiān.', french: 'Aujourd\'hui, il fait beau.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '明天会晴吗？', pinyin: 'Míngtiān huì qíng ma?', french: 'Fera-t-il beau demain ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '昨天下雨了，今天晴了。', pinyin: 'Zuótiān xià yǔ le, jīntiān qíng le.', french: 'Hier il a plu, aujourd\'hui le ciel s\'est dégagé.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '去年': [
    { hanzi: '我去年认识了他。', pinyin: 'Wǒ qùnián rènshi le tā.', french: 'J\'ai fait sa connaissance l\'année dernière.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #510904', source: 'tatoeba' },
    { hanzi: '去年下了很多雪。', pinyin: 'Qùnián xià le hěn duō xuě.', french: 'Il a beaucoup neigé l\'année dernière.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #336618', source: 'tatoeba' },
    { hanzi: '她去年跟他结婚了。', pinyin: 'Tā qùnián gēn tā jiéhūn le.', french: 'Elle l\'a épousé l\'année dernière.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #1513581', source: 'tatoeba' },
  ],
  '让': [
    { hanzi: '让我想一想。', pinyin: 'Ràng wǒ xiǎng yi xiǎng.', french: 'Laisse-moi réfléchir une minute !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #4504253', source: 'tatoeba' },
    { hanzi: '那条新裙子让她很满意。', pinyin: 'Nà tiáo xīn qúnzi ràng tā hěn mǎnyì.', french: 'La nouvelle robe lui plut.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #333751', source: 'tatoeba' },
    { hanzi: '这个消息让她很伤心。', pinyin: 'Zhège xiāoxi ràng tā hěn shāngxīn.', french: 'La nouvelle l\'a rendue triste.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #334540', source: 'tatoeba' },
  ],
  '上班': [
    { hanzi: '你几点上班？', pinyin: 'Nǐ jǐ diǎn shàngbān?', french: 'Tu commences à quelle heure ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #2302762', source: 'tatoeba' },
    { hanzi: '我明天不想上班。', pinyin: 'Wǒ míngtiān bù xiǎng shàngbān.', french: 'Je ne veux pas travailler demain.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #11702402', source: 'tatoeba' },
    { hanzi: '我爸爸每天坐公共汽车上班。', pinyin: 'Wǒ bàba měitiān zuò gōnggòng qìchē shàngbān.', french: 'Mon père va au travail en bus tous les jours.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '身体': [
    { hanzi: '我父亲身体很健康。', pinyin: 'Wǒ fùqīn shēntǐ hěn jiànkāng.', french: 'Mon père est en bonne santé.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #784039', source: 'tatoeba' },
    { hanzi: '他担心他父亲的身体。', pinyin: 'Tā dānxīn tā fùqīn de shēntǐ.', french: 'Il se préoccupe de la santé de son père.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #343946', source: 'tatoeba' },
    { hanzi: '新鲜水果对身体好。', pinyin: 'Xīnxiān shuǐguǒ duì shēntǐ hǎo.', french: 'Les fruits frais sont bons pour ta santé.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #339219', source: 'tatoeba' },
  ],
  '生病': [
    { hanzi: '他生病了。', pinyin: 'Tā shēngbìng le.', french: 'Il est malade.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #982224', source: 'tatoeba' },
    { hanzi: '虽然他生病了，他还是去了学校。', pinyin: 'Suīrán tā shēngbìng le, tā háishi qù le xuéxiào.', french: 'Bien qu\'il fût malade, il alla à l\'école.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #461540', source: 'tatoeba' },
    { hanzi: '你应该照顾你生病的母亲。', pinyin: 'Nǐ yīnggāi zhàogu nǐ shēngbìng de mǔqīn.', french: 'Vous devez vous occuper de votre mère malade.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #775593', source: 'tatoeba' },
  ],
  '生日': [
    { hanzi: '今天是我生日。', pinyin: 'Jīntiān shì wǒ shēngrì.', french: 'Aujourd\'hui, c\'est mon anniversaire.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10114136', source: 'tatoeba' },
    { hanzi: '你生日的时候，我送你一辆自行车。', pinyin: 'Nǐ shēngrì de shíhou, wǒ sòng nǐ yí liàng zìxíngchē.', french: 'Je te donnerai un vélo pour ton anniversaire.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #334048', source: 'tatoeba' },
    { hanzi: '我几乎忘记是他的生日。', pinyin: 'Wǒ jīhū wàngjì shì tā de shēngrì.', french: 'J\'oubliai presque que c\'était son anniversaire.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #465028', source: 'tatoeba' },
  ],
  '时间': [
    { hanzi: '我没时间。', pinyin: 'Wǒ méi shíjiān.', french: 'Je n\'ai pas le temps.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #782929', source: 'tatoeba' },
    { hanzi: '这需要时间。', pinyin: 'Zhè xūyào shíjiān.', french: 'Cela prend du temps.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #707522', source: 'tatoeba' },
    { hanzi: '时间过得多快呀。', pinyin: 'Shíjiān guò de duō kuài ya.', french: 'Comme le temps passe.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9484585', source: 'tatoeba' },
  ],
  '事情': [
    { hanzi: '今天你有什么事情吗？', pinyin: 'Jīntiān nǐ yǒu shénme shìqing ma?', french: 'As-tu quelque chose à faire aujourd\'hui ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #2394645', source: 'tatoeba' },
    { hanzi: '你像是在想其他事情。', pinyin: 'Nǐ xiàng shì zài xiǎng qítā shìqing.', french: 'Tu as l\'air de penser à autre chose.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #336033', source: 'tatoeba' },
    { hanzi: '没有人能做所有的事情。', pinyin: 'Méiyǒu rén néng zuò suǒyǒu de shìqing.', french: 'Nul n’est capable de tout.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9576702', source: 'tatoeba' },
  ],
  '手表': [
    { hanzi: '我喜欢这块手表。', pinyin: 'Wǒ xǐhuan zhè kuài shǒubiǎo.', french: 'J\'aime cette montre.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10852438', source: 'tatoeba' },
    { hanzi: '这块儿手表坏了。', pinyin: 'Zhè kuàir shǒubiǎo huài le.', french: 'Cette montre ne fonctionne pas.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #10477390', source: 'tatoeba' },
    { hanzi: '我昨天丢了我的手表。', pinyin: 'Wǒ zuótiān diū le wǒ de shǒubiǎo.', french: 'J\'ai perdu ma montre hier.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #512443', source: 'tatoeba' },
  ],
  '手机': [
    { hanzi: '您的手机号码是多少？', pinyin: 'Nín de shǒujī hàomǎ shì duōshao?', french: 'Quel est votre numéro de téléphone ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #3378151', source: 'tatoeba' },
    { hanzi: '年轻人几乎都有手机。', pinyin: 'Niánqīngrén jīhū dōu yǒu shǒujī.', french: 'La plupart des jeunes ont un téléphone portable.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #1148299', source: 'tatoeba' },
    { hanzi: '你多久用一次手机？', pinyin: 'Nǐ duōjiǔ yòng yí cì shǒujī?', french: 'À quelle fréquence utilisez-vous votre téléphone ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9955820', source: 'tatoeba' },
  ],
  '送': [
    { hanzi: '我们送给他一块手表。', pinyin: 'Wǒmen sòng gěi tā yí kuài shǒubiǎo.', french: 'Nous lui avons offert une montre.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #408815', source: 'tatoeba' },
    { hanzi: '她想知道是谁送的花。', pinyin: 'Tā xiǎng zhīdào shì shéi sòng de huā.', french: 'Elle voudrait savoir qui a envoyé les fleurs.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #1891663', source: 'tatoeba' },
    { hanzi: '尽管很忙，她还是来送我了。', pinyin: 'Jǐnguǎn hěn máng, tā háishi lái sòng wǒ le.', french: 'Bien qu\'elle ait été très occupée, elle est quand même venue me voir partir.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #335272', source: 'tatoeba' },
  ],
  '所以': [
    { hanzi: '我很忙，所以我不能去了。', pinyin: 'Wǒ hěn máng, suǒyǐ wǒ bù néng qù le.', french: 'Comme je suis occupé, je ne peux pas y aller.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #819766', source: 'tatoeba' },
    { hanzi: '她很会打扮，所以不管穿上什么都合适。', pinyin: 'Tā hěn huì dǎban, suǒyǐ bùguǎn chuān shang shénme dōu héshì.', french: 'Elle sait vraiment se maquiller, du coup qu\'importe ce qu\'elle porte, cela lui va.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #429342', source: 'tatoeba' },
    { hanzi: '因为我什么都弄完了，所以我要去休息一下。', pinyin: 'Yīnwèi wǒ shénme dōu nòng wán le, suǒyǐ wǒ yào qù xiūxi yíxià.', french: 'Comme j\'ai tout fini de faire, je vais donc aller me reposer un peu.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #382379', source: 'tatoeba' },
  ],
  '它': [
    { hanzi: '谁想要它？', pinyin: 'Shéi xiǎngyào tā?', french: 'Qui veut ça ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10182737', source: 'tatoeba' },
    { hanzi: '把它带给我。', pinyin: 'Bǎ tā dài gěi wǒ.', french: 'Apportez-le-moi.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #745903', source: 'tatoeba' },
    { hanzi: '生命不长，它是宽的！', pinyin: 'Shēngmìng bù cháng, tā shì kuān de!', french: 'La vie n\'est pas longue, elle est large !', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #503312', source: 'tatoeba' },
  ],
  '踢': [
    { hanzi: '他喜欢踢足球。', pinyin: 'Tā xǐhuan tī zúqiú.', french: 'Il aime jouer au football.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '他在踢我！', pinyin: 'Tā zài tī wǒ!', french: 'Il me donne des coups de pied !', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #42', source: 'tatoeba' },
    { hanzi: '我们去踢足球吧。', pinyin: 'Wǒmen qù tī zúqiú ba.', french: 'Allons jouer au football.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '题': [
    { hanzi: '这个题很难。', pinyin: 'Zhège tí hěn nán.', french: 'Cet exercice est difficile.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '第一题我不会。', pinyin: 'Dìyī tí wǒ bú huì.', french: 'Je ne sais pas faire le premier exercice.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '这次考试的题不难。', pinyin: 'Zhè cì kǎoshì de tí bù nán.', french: 'Les questions de cet examen ne sont pas difficiles.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '跳舞': [
    { hanzi: '我想跳舞。', pinyin: 'Wǒ xiǎng tiàowǔ.', french: 'Je veux danser.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1962854', source: 'tatoeba' },
    { hanzi: '你愿意和我跳舞吗？', pinyin: 'Nǐ yuànyì hé wǒ tiàowǔ ma?', french: 'Veux-tu danser avec moi ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #336871', source: 'tatoeba' },
    { hanzi: '可惜你不会跳舞！', pinyin: 'Kěxī nǐ bú huì tiàowǔ!', french: 'Quel dommage que tu ne saches pas danser !', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #943692', source: 'tatoeba' },
  ],
  '外': [
    { hanzi: '他已经外出了。', pinyin: 'Tā yǐjīng wàichū le.', french: 'Il est déjà sorti.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1020691', source: 'tatoeba' },
    { hanzi: '我是这里的外地人。', pinyin: 'Wǒ shì zhèlǐ de wàidìrén.', french: 'Je suis un étranger, ici.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #941138', source: 'tatoeba' },
    { hanzi: '我在外地生活了很久。', pinyin: 'Wǒ zài wàidì shēnghuó le hěn jiǔ.', french: 'J\'ai vécu longtemps ailleurs.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9518534', source: 'tatoeba' },
  ],
  '完': [
    { hanzi: '我看完了这本书。', pinyin: 'Wǒ kàn wán le zhè běn shū.', french: 'J\'ai fini de lire ce livre.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #490039', source: 'tatoeba' },
    { hanzi: '我还没做完练习。', pinyin: 'Wǒ hái méi zuò wán liànxí.', french: 'Je n\'ai pas encore terminé l\'exercice.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #835615', source: 'tatoeba' },
    { hanzi: '你明天来的时候，我就看完这本小说了。', pinyin: 'Nǐ míngtiān lái de shíhou, wǒ jiù kàn wán zhè běn xiǎoshuō le.', french: 'J\'aurai fini de lire ce roman au moment où tu viendras demain.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #819821', source: 'tatoeba' },
  ],
  '玩': [
    { hanzi: '我们一起玩吗？', pinyin: 'Wǒmen yìqǐ wán ma?', french: 'On joue ensemble ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #677017', source: 'tatoeba' },
    { hanzi: '我在花园里玩。', pinyin: 'Wǒ zài huāyuán li wán.', french: 'Je joue dans le jardin.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #2785224', source: 'tatoeba' },
    { hanzi: '他的帽子很好玩。', pinyin: 'Tā de màozi hěn hǎowán.', french: 'Son chapeau était très drôle.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #336425', source: 'tatoeba' },
  ],
  '晚上': [
    { hanzi: '晚上好。', pinyin: 'Wǎnshang hǎo.', french: 'Bonsoir !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #333158', source: 'tatoeba' },
    { hanzi: '我们今天晚上七点跟他见面。', pinyin: 'Wǒmen jīntiān wǎnshang qī diǎn gēn tā jiànmiàn.', french: 'Nous le rencontrerons à sept heures du soir.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #780386', source: 'tatoeba' },
    { hanzi: '为什么月亮晚上发光？', pinyin: 'Wèishénme yuèliang wǎnshang fāguāng?', french: 'Pourquoi la lune brille-t-elle la nuit ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #426315', source: 'tatoeba' },
  ],
  '为': [
    { hanzi: '他为她工作。', pinyin: 'Tā wèi tā gōngzuò.', french: 'Il travaille pour elle.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #343864', source: 'tatoeba' },
    { hanzi: '你不用再为我担心了。', pinyin: 'Nǐ bú yòng zài wèi wǒ dānxīn le.', french: 'Tu n\'as plus à t\'inquiéter pour moi.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #12686304', source: 'tatoeba' },
    { hanzi: '他母亲为他担心。', pinyin: 'Tā mǔqīn wèi tā dānxīn.', french: 'Sa mère s\'inquiète à son sujet.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #842690', source: 'tatoeba' },
  ],
  '问': [
    { hanzi: '她问这怎么可能。', pinyin: 'Tā wèn zhè zěnme kěnéng.', french: 'Elle demande comment c’est possible.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #501363', source: 'tatoeba' },
    { hanzi: '再问他也没用。', pinyin: 'Zài wèn tā yě méi yòng.', french: 'Ça ne sert à rien de lui redemander.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #796901', source: 'tatoeba' },
    { hanzi: '等她回来的时候问问她。', pinyin: 'Děng tā huílai de shíhou wènwen tā.', french: 'Demande-lui quand elle reviendra.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #332472', source: 'tatoeba' },
  ],
  '问题': [
    { hanzi: '我可以问你个问题吗？', pinyin: 'Wǒ kěyǐ wèn nǐ ge wèntí ma?', french: 'Puis-je vous poser une question ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #480595', source: 'tatoeba' },
    { hanzi: '这个问题很难解决。', pinyin: 'Zhège wèntí hěn nán jiějué.', french: 'Ce problème est difficile à résoudre.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #335613', source: 'tatoeba' },
    { hanzi: '这问题正在被讨论。', pinyin: 'Zhè wèntí zhèngzài bèi tǎolùn.', french: 'On est en train de parler du problème en ce moment.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #333526', source: 'tatoeba' },
  ],
  '希望': [
    { hanzi: '我希望会看见她。', pinyin: 'Wǒ xīwàng huì kànjiàn tā.', french: 'J\'espère que je la verrai.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #709066', source: 'tatoeba' },
    { hanzi: '我希望住在你家附近。', pinyin: 'Wǒ xīwàng zhù zài nǐ jiā fùjìn.', french: 'J\'espère que je vivrai près de chez toi.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #333534', source: 'tatoeba' },
    { hanzi: '我希望最后一切都好。', pinyin: 'Wǒ xīwàng zuìhòu yíqiè dōu hǎo.', french: 'J\'espère que tout ira bien à la fin.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #333980', source: 'tatoeba' },
  ],
  '洗': [
    { hanzi: '我洗好了。', pinyin: 'Wǒ xǐ hǎo le.', french: 'J\'ai fini de me laver.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #2300033', source: 'tatoeba' },
    { hanzi: '洗你的脚。', pinyin: 'Xǐ nǐ de jiǎo.', french: 'Lave tes pieds.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #487593', source: 'tatoeba' },
    { hanzi: '把脏衣服拿去洗一洗！', pinyin: 'Bǎ zāng yīfu ná qù xǐ yi xǐ!', french: 'Prends les habits sales et va les laver !', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #419982', source: 'tatoeba' },
  ],
  '西瓜': [
    { hanzi: '我很喜欢吃西瓜。', pinyin: 'Wǒ hěn xǐhuan chī xīguā.', french: 'J\'adore manger des pastèques.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #402831', source: 'tatoeba' },
    { hanzi: '这是一种西瓜。', pinyin: 'Zhè shì yì zhǒng xīguā.', french: 'C\'est une variété de pastèque.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #334498', source: 'tatoeba' },
    { hanzi: '我喜欢西瓜的味道。', pinyin: 'Wǒ xǐhuan xīguā de wèidao.', french: 'J’aime le goût des pastèques.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #392763', source: 'tatoeba' },
  ],
  '向': [
    { hanzi: '有个女人向我问路。', pinyin: 'Yǒu ge nǚrén xiàng wǒ wèn lù.', french: 'Une femme m\'a demandé le chemin.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #348516', source: 'tatoeba' },
    { hanzi: '我向他借了这本书。', pinyin: 'Wǒ xiàng tā jiè le zhè běn shū.', french: 'Je lui ai emprunté ce livre.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #472872', source: 'tatoeba' },
    { hanzi: '我不得不向她道歉。', pinyin: 'Wǒ bùdébù xiàng tā dàoqiàn.', french: 'Je dois lui présenter mes excuses.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #339474', source: 'tatoeba' },
  ],
  '小时': [
    { hanzi: '他走了几个小时。', pinyin: 'Tā zǒu le jǐ ge xiǎoshí.', french: 'Il avait marché durant des heures.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #711087', source: 'tatoeba' },
    { hanzi: '我已经来了两个小时。', pinyin: 'Wǒ yǐjīng lái le liǎng ge xiǎoshí.', french: 'Je suis là depuis déjà deux heures.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #385287', source: 'tatoeba' },
    { hanzi: '他讲了一小时。', pinyin: 'Tā jiǎng le yì xiǎoshí.', french: 'Il a parlé pendant une heure.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #799216', source: 'tatoeba' },
  ],
  '笑': [
    { hanzi: '我笑了。', pinyin: 'Wǒ xiào le.', french: 'J\'ai ri.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #335165', source: 'tatoeba' },
    { hanzi: '他总是在笑。', pinyin: 'Tā zǒngshì zài xiào.', french: 'Il est toujours en train de rire.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #334059', source: 'tatoeba' },
    { hanzi: '这个让我笑死了！', pinyin: 'Zhège ràng wǒ xiào sǐ le!', french: 'C\'est à mourir de rire !', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #1815631', source: 'tatoeba' },
  ],
  '新': [
    { hanzi: '他是新来的。', pinyin: 'Tā shì xīn lái de.', french: 'C\'est un nouveau venu.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1064508', source: 'tatoeba' },
    { hanzi: '我想买一辆新的自行车。', pinyin: 'Wǒ xiǎng mǎi yí liàng xīn de zìxíngchē.', french: 'Je veux acheter un nouveau vélo.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #9453438', source: 'tatoeba' },
    { hanzi: '她有一台新电脑吗？', pinyin: 'Tā yǒu yì tái xīn diànnǎo ma?', french: 'Est-ce qu\'elle a un nouvel ordinateur ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #5941745', source: 'tatoeba' },
  ],
  '姓': [
    { hanzi: '我姓王。', pinyin: 'Wǒ xìng Wáng.', french: 'Mon nom de famille est Wang.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '我没听到您的姓。', pinyin: 'Wǒ méi tīngdào nín de xìng.', french: 'Je n\'ai pas saisi votre nom de famille.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #472889', source: 'tatoeba' },
    { hanzi: '请问你贵姓？', pinyin: 'Qǐngwèn nǐ guìxìng?', french: 'Puis-je vous demander votre nom ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #347326', source: 'tatoeba' },
  ],
  '休息': [
    { hanzi: '我想休息一下。', pinyin: 'Wǒ xiǎng xiūxi yíxià.', french: 'J\'ai envie de me reposer.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #343975', source: 'tatoeba' },
    { hanzi: '我能休息一会儿吗？', pinyin: 'Wǒ néng xiūxi yíhuìr ma?', french: 'Puis-je me reposer un peu ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #334654', source: 'tatoeba' },
    { hanzi: '他休息了一会儿。', pinyin: 'Tā xiūxi le yíhuìr.', french: 'Il s\'est reposé un moment.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #352061', source: 'tatoeba' },
  ],
  '雪': [
    { hanzi: '我们喜欢雪。', pinyin: 'Wǒmen xǐhuan xuě.', french: 'Nous aimons la neige.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #9980175', source: 'tatoeba' },
    { hanzi: '开始下雪了。', pinyin: 'Kāishǐ xià xuě le.', french: 'Il a commencé à neiger.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #794257', source: 'tatoeba' },
    { hanzi: '根据报纸，明天会下雪。', pinyin: 'Gēnjù bàozhǐ, míngtiān huì xià xuě.', french: 'Selon les journaux, il neigera demain.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #408481', source: 'tatoeba' },
  ],
  '颜色': [
    { hanzi: '我喜欢这个颜色。', pinyin: 'Wǒ xǐhuan zhège yánsè.', french: 'J\'aime cette couleur.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10369292', source: 'tatoeba' },
    { hanzi: '这条鱼是什么颜色？', pinyin: 'Zhè tiáo yú shì shénme yánsè?', french: 'De quelle couleur est ce poisson ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #2779529', source: 'tatoeba' },
    { hanzi: '你可以选择任何你喜欢的颜色。', pinyin: 'Nǐ kěyǐ xuǎnzé rènhé nǐ xǐhuan de yánsè.', french: 'Tu peux choisir n\'importe quelle couleur que tu aimes.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #344418', source: 'tatoeba' },
  ],
  '眼睛': [
    { hanzi: '她看着我的眼睛。', pinyin: 'Tā kànzhe wǒ de yǎnjing.', french: 'Elle m\'a regardé dans les yeux.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10460418', source: 'tatoeba' },
    { hanzi: '她有一双漂亮的眼睛。', pinyin: 'Tā yǒu yì shuāng piàoliang de yǎnjing.', french: 'Elle a de beaux yeux.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #1343684', source: 'tatoeba' },
    { hanzi: '她的眼睛哭红了。', pinyin: 'Tā de yǎnjing kū hóng le.', french: 'Ses yeux étaient rouges à force de pleurer.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #12799517', source: 'tatoeba' },
  ],
  '羊肉': [
    { hanzi: '我不吃羊肉。', pinyin: 'Wǒ bù chī yángròu.', french: 'Je ne mange pas de mouton.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '羊肉多少钱一公斤？', pinyin: 'Yángròu duōshao qián yì gōngjīn?', french: 'Combien coûte le kilo de mouton ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '北京的羊肉很好吃。', pinyin: 'Běijīng de yángròu hěn hǎochī.', french: 'Le mouton de Pékin est délicieux.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '药': [
    { hanzi: '我吃了药。', pinyin: 'Wǒ chī le yào.', french: 'J\'ai pris les médicaments.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #759374', source: 'tatoeba' },
    { hanzi: '如果你吃这药，你会觉得好一点。', pinyin: 'Rúguǒ nǐ chī zhè yào, nǐ huì juéde hǎo yìdiǎn.', french: 'Ce remède te fera te sentir mieux.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #400983', source: 'tatoeba' },
    { hanzi: '您已经吃过药了吗？', pinyin: 'Nín yǐjīng chīguo yào le ma?', french: 'Avez-vous déjà pris vos médicaments ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #476603', source: 'tatoeba' },
  ],
  '要': [
    { hanzi: '我不要钱。', pinyin: 'Wǒ bú yào qián.', french: 'Je ne veux pas d\'argent.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #784401', source: 'tatoeba' },
    { hanzi: '我要一杯咖啡。', pinyin: 'Wǒ yào yì bēi kāfēi.', french: 'Je voudrais un café.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '你要出去散步吗？', pinyin: 'Nǐ yào chūqu sànbù ma?', french: 'Aimerais-tu aller en promenade ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9453423', source: 'tatoeba' },
  ],
  '也': [
    { hanzi: '我也不喜欢她。', pinyin: 'Wǒ yě bù xǐhuan tā.', french: 'Je ne l\'aime pas non plus.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1835740', source: 'tatoeba' },
    { hanzi: '“她喜欢音乐。”“我也是。”', pinyin: '“Tā xǐhuan yīnyuè.” “Wǒ yě shì.”', french: '« Elle aime la musique. » « Moi aussi. »', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #334470', source: 'tatoeba' },
    { hanzi: '我也过得很愉快。', pinyin: 'Wǒ yě guò de hěn yúkuài.', french: 'J\'ai aussi passé un très bon moment.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #333496', source: 'tatoeba' },
  ],
  '一起': [
    { hanzi: '和我们一起来吧。', pinyin: 'Hé wǒmen yìqǐ lái ba.', french: 'Venez avec nous.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #345794', source: 'tatoeba' },
    { hanzi: '我只想和你在一起。', pinyin: 'Wǒ zhǐ xiǎng hé nǐ zài yìqǐ.', french: 'Je veux juste être avec toi.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #10569134', source: 'tatoeba' },
    { hanzi: '他们在一起很幸福。', pinyin: 'Tāmen zài yìqǐ hěn xìngfú.', french: 'Ils étaient heureux ensemble.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #10783968', source: 'tatoeba' },
  ],
  '已经': [
    { hanzi: '他已经走了吗？', pinyin: 'Tā yǐjīng zǒu le ma?', french: 'Est-il déjà parti ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #366870', source: 'tatoeba' },
    { hanzi: '我已经吃饱了，谢谢。', pinyin: 'Wǒ yǐjīng chībǎo le, xièxie.', french: 'J\'en ai eu suffisamment, merci.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #333663', source: 'tatoeba' },
    { hanzi: '他希望已经成功了。', pinyin: 'Tā xīwàng yǐjīng chénggōng le.', french: 'Il espérait avoir réussi.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #333467', source: 'tatoeba' },
  ],
  '意思': [
    { hanzi: '这是什么意思？', pinyin: 'Zhè shì shénme yìsi?', french: 'Qu\'est-ce que cela signifie ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #469553', source: 'tatoeba' },
    { hanzi: '他的故事很有意思。', pinyin: 'Tā de gùshi hěn yǒu yìsi.', french: 'Son histoire était intéressante.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #1313748', source: 'tatoeba' },
    { hanzi: '我不理解你的意思。', pinyin: 'Wǒ bù lǐjiě nǐ de yìsi.', french: 'Je ne comprends pas ce que tu veux dire.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #10649046', source: 'tatoeba' },
  ],
  '因为': [
    { hanzi: '因为我没听到。', pinyin: 'Yīnwèi wǒ méi tīngdào.', french: 'C\'est parce que je n\'ai pas entendu.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #419970', source: 'tatoeba' },
    { hanzi: '我不能出去，因为我有作业。', pinyin: 'Wǒ bù néng chūqù, yīnwèi wǒ yǒu zuòyè.', french: 'Je ne peux pas sortir parce que j\'ai des devoirs.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #347098', source: 'tatoeba' },
    { hanzi: '今天早上我因为太懒而没有出门。', pinyin: 'Jīntiān zǎoshang wǒ yīnwèi tài lǎn ér méiyǒu chūmén.', french: 'Ce matin j\'étais si paresseux que je ne suis pas sorti.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #382446', source: 'tatoeba' },
  ],
  '阴': [
    { hanzi: '今天是阴天。', pinyin: 'Jīntiān shì yīntiān.', french: 'Aujourd\'hui, le temps est couvert.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '天阴了，可能要下雨。', pinyin: 'Tiān yīn le, kěnéng yào xià yǔ.', french: 'Le ciel se couvre, il va peut-être pleuvoir.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '明天是阴天还是晴天？', pinyin: 'Míngtiān shì yīntiān háishi qíngtiān?', french: 'Demain, temps couvert ou ensoleillé ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '游泳': [
    { hanzi: '他会游泳。', pinyin: 'Tā huì yóuyǒng.', french: 'Il sait nager.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #408816', source: 'tatoeba' },
    { hanzi: '游泳很容易。', pinyin: 'Yóuyǒng hěn róngyì.', french: 'Nager, c\'est facile.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #832937', source: 'tatoeba' },
    { hanzi: '在这条河里游泳很危险。', pinyin: 'Zài zhè tiáo hé li yóuyǒng hěn wēixiǎn.', french: 'Il est dangereux de nager dans cette rivière.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #352038', source: 'tatoeba' },
  ],
  '右边': [
    { hanzi: '我在右边。', pinyin: 'Wǒ zài yòubian.', french: 'Je suis à droite.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #810662', source: 'tatoeba' },
    { hanzi: '请坐在我右边。', pinyin: 'Qǐng zuò zài wǒ yòubian.', french: 'Asseyez-vous à ma droite, s\'il vous plaît.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '学校在医院右边。', pinyin: 'Xuéxiào zài yīyuàn yòubian.', french: 'L\'école est à droite de l\'hôpital.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '鱼': [
    { hanzi: '他们吃鱼。', pinyin: 'Tāmen chī yú.', french: 'Ils mangent du poisson.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10696094', source: 'tatoeba' },
    { hanzi: '我想要一条鱼。', pinyin: 'Wǒ xiǎngyào yì tiáo yú.', french: 'Je voudrais un poisson.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #661519', source: 'tatoeba' },
    { hanzi: '这条鱼不能吃了。', pinyin: 'Zhè tiáo yú bù néng chī le.', french: 'Ce poisson n\'est pas comestible.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9961334', source: 'tatoeba' },
  ],
  '元': [
    { hanzi: '这本书二十元。', pinyin: 'Zhè běn shū èrshí yuán.', french: 'Ce livre coûte vingt yuans.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '一杯咖啡三十元。', pinyin: 'Yì bēi kāfēi sānshí yuán.', french: 'Un café coûte trente yuans.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '这件衣服一百五十元。', pinyin: 'Zhè jiàn yīfu yìbǎi wǔshí yuán.', french: 'Ce vêtement coûte cent cinquante yuans.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
  ],
  '远': [
    { hanzi: '离这里很远吗？', pinyin: 'Lí zhèlǐ hěn yuǎn ma?', french: 'Est-ce très loin d\'ici ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #9409415', source: 'tatoeba' },
    { hanzi: '她没有走远。', pinyin: 'Tā méiyǒu zǒu yuǎn.', french: 'Elle n\'est pas allée loin.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #866733', source: 'tatoeba' },
    { hanzi: '有是有的，不过远了一点。', pinyin: 'Yǒu shì yǒu de, búguò yuǎn le yìdiǎn.', french: 'Il y en a un, mais c\'est un peu loin.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #827062', source: 'tatoeba' },
  ],
  '运动': [
    { hanzi: '你喜欢运动吗？', pinyin: 'Nǐ xǐhuan yùndòng ma?', french: 'Aimes-tu le sport ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #345825', source: 'tatoeba' },
    { hanzi: '他们从不做运动。', pinyin: 'Tāmen cóngbù zuò yùndòng.', french: 'Ils ne font jamais de sport.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #843480', source: 'tatoeba' },
    { hanzi: '她喜欢各种运动。', pinyin: 'Tā xǐhuan gèzhǒng yùndòng.', french: 'Elle aime toutes sortes de sports.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #1019951', source: 'tatoeba' },
  ],
  '再': [
    { hanzi: '您想再来点茶吗？', pinyin: 'Nín xiǎng zài lái diǎn chá ma?', french: 'Voulez-vous un peu plus de thé ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #334887', source: 'tatoeba' },
    { hanzi: '再想别的办法吧。', pinyin: 'Zài xiǎng biéde bànfǎ ba.', french: 'On va trouver un autre moyen de le faire.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #10511443', source: 'tatoeba' },
    { hanzi: '我再也不能等了。', pinyin: 'Wǒ zài yě bù néng děng le.', french: 'Je ne peux pas attendre plus longtemps.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #343459', source: 'tatoeba' },
  ],
  '早上': [
    { hanzi: '早上好！', pinyin: 'Zǎoshang hǎo!', french: 'Bonjour !', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #335381', source: 'tatoeba' },
    { hanzi: '今天早上很冷。', pinyin: 'Jīntiān zǎoshang hěn lěng.', french: 'Il faisait très froid ce matin.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #859151', source: 'tatoeba' },
    { hanzi: '今天早上我去了公园。', pinyin: 'Jīntiān zǎoshang wǒ qù le gōngyuán.', french: 'Je suis allé au jardin public ce matin.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #410855', source: 'tatoeba' },
  ],
  '张': [
    { hanzi: '我有三张票。', pinyin: 'Wǒ yǒu sān zhāng piào.', french: 'J\'ai trois places.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #343849', source: 'tatoeba' },
    { hanzi: '好好看这张照片。', pinyin: 'Hǎohǎo kàn zhè zhāng zhàopiàn.', french: 'Regarde bien cette photo.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #342846', source: 'tatoeba' },
    { hanzi: '他把一张照片挂在墙上。', pinyin: 'Tā bǎ yì zhāng zhàopiàn guà zài qiáng shang.', french: 'Il accrocha une photo au mur.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #512870', source: 'tatoeba' },
  ],
  '长': [
    { hanzi: '他的腿很长。', pinyin: 'Tā de tuǐ hěn cháng.', french: 'Il a de longues jambes.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #453742', source: 'tatoeba' },
    { hanzi: '你的头发太长了。', pinyin: 'Nǐ de tóufa tài cháng le.', french: 'Tes cheveux sont trop longs.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #425414', source: 'tatoeba' },
    { hanzi: '我最长的爱情是四个月。', pinyin: 'Wǒ zuì cháng de àiqíng shì sì ge yuè.', french: 'Ma plus longue relation amoureuse a duré quatre mois.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #1517352', source: 'tatoeba' },
  ],
  '丈夫': [
    { hanzi: '她丈夫是医生。', pinyin: 'Tā zhàngfu shì yīshēng.', french: 'Son mari est médecin.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '他会是个好丈夫的。', pinyin: 'Tā huì shì ge hǎo zhàngfu de.', french: 'Il ferait un bon mari.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #782142', source: 'tatoeba' },
    { hanzi: '我和我的丈夫都是老师。', pinyin: 'Wǒ hé wǒ de zhàngfu dōu shì lǎoshī.', french: 'Mon mari et moi sommes tous les deux enseignants.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #1171771', source: 'tatoeba' },
  ],
  '找': [
    { hanzi: '你们在找什么？', pinyin: 'Nǐmen zài zhǎo shénme?', french: 'Que cherchez-vous ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1188965', source: 'tatoeba' },
    { hanzi: '请给我找一把椅子。', pinyin: 'Qǐng gěi wǒ zhǎo yì bǎ yǐzi.', french: 'Merci d\'aller me chercher une chaise.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #394594', source: 'tatoeba' },
    { hanzi: '我找到那把我一直在找的钥匙了。', pinyin: 'Wǒ zhǎodào nà bǎ wǒ yìzhí zài zhǎo de yàoshi le.', french: 'J\'ai enfin trouvé cette clef que je n\'arrête pas de chercher.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #332433', source: 'tatoeba' },
  ],
  '着': [
    { hanzi: '拿着。', pinyin: 'Názhe.', french: 'Tenez.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #333669', source: 'tatoeba' },
    { hanzi: '猫看着鱼。', pinyin: 'Māo kànzhe yú.', french: 'Le chat regarde le poisson.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #466164', source: 'tatoeba' },
    { hanzi: '她母亲一直陪着她。', pinyin: 'Tā mǔqīn yìzhí péizhe tā.', french: 'Sa mère l\'accompagne toujours.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #476632', source: 'tatoeba' },
  ],
  '真': [
    { hanzi: '这不是真的。', pinyin: 'Zhè bú shì zhēn de.', french: 'C\'est pas vrai.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #409219', source: 'tatoeba' },
    { hanzi: '你真高啊！', pinyin: 'Nǐ zhēn gāo a!', french: 'Qu\'est-ce que tu es grand !', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #373180', source: 'tatoeba' },
    { hanzi: '您真的了解她吗？', pinyin: 'Nín zhēn de liǎojiě tā ma?', french: 'La connaissez-vous vraiment ?', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #343643', source: 'tatoeba' },
  ],
  '正在': [
    { hanzi: '我正在看电视。', pinyin: 'Wǒ zhèngzài kàn diànshì.', french: 'Je suis en train de regarder la télévision.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #472985', source: 'tatoeba' },
    { hanzi: '她正在写信。', pinyin: 'Tā zhèngzài xiě xìn.', french: 'Elle écrit une lettre maintenant.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #397630', source: 'tatoeba' },
    { hanzi: '他来的时候，我正在洗澡。', pinyin: 'Tā lái de shíhou, wǒ zhèngzài xǐzǎo.', french: 'J\'étais dans mon bain quand il est venu.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #438486', source: 'tatoeba' },
  ],
  '知道': [
    { hanzi: '我不知道。', pinyin: 'Wǒ bù zhīdào.', french: 'Je ne sais pas.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #10', source: 'tatoeba' },
    { hanzi: '我知道他住哪儿。', pinyin: 'Wǒ zhīdào tā zhù nǎr.', french: 'Je sais où il habite.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #333770', source: 'tatoeba' },
    { hanzi: '看起来他什么都知道。', pinyin: 'Kànqǐlai tā shénme dōu zhīdào.', french: 'Il semble qu\'il sache tout.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #9534809', source: 'tatoeba' },
  ],
  '准备': [
    { hanzi: '你准备好了吗？', pinyin: 'Nǐ zhǔnbèi hǎo le ma?', french: 'Es-tu prêt ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #799302', source: 'tatoeba' },
    { hanzi: '你们准备参加会议吗？', pinyin: 'Nǐmen zhǔnbèi cānjiā huìyì ma?', french: 'Prévoyez-vous de participer à la réunion ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #819749', source: 'tatoeba' },
    { hanzi: '她戴上了帽子准备出去。', pinyin: 'Tā dàishang le màozi zhǔnbèi chūqù.', french: 'Elle mit son chapeau pour sortir.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #429165', source: 'tatoeba' },
  ],
  '自行车': [
    { hanzi: '你有自行车吗？', pinyin: 'Nǐ yǒu zìxíngchē ma?', french: 'As-tu un vélo ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #9179738', source: 'tatoeba' },
    { hanzi: '这辆自行车是谁的？', pinyin: 'Zhè liàng zìxíngchē shì shéi de?', french: 'À qui est cette bicyclette ?', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #334531', source: 'tatoeba' },
    { hanzi: '我母亲不会骑自行车。', pinyin: 'Wǒ mǔqīn bú huì qí zìxíngchē.', french: 'Ma mère ne sait pas faire de vélo.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #401033', source: 'tatoeba' },
  ],
  '走': [
    { hanzi: '他慢慢地走。', pinyin: 'Tā mànmàn de zǒu.', french: 'Il marche lentement.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #512111', source: 'tatoeba' },
    { hanzi: '你走了，我们都会想你的。', pinyin: 'Nǐ zǒu le, wǒmen dōu huì xiǎng nǐ de.', french: 'Tu nous manqueras à tous quand tu partiras.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #332548', source: 'tatoeba' },
    { hanzi: '我恐怕现在必须走了。', pinyin: 'Wǒ kǒngpà xiànzài bìxū zǒu le.', french: 'J\'ai peur de devoir partir maintenant.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #473007', source: 'tatoeba' },
  ],
  '最': [
    { hanzi: '您最喜欢什么水果？', pinyin: 'Nín zuì xǐhuan shénme shuǐguǒ?', french: 'Quel fruit aimez-vous le plus ?', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Tatoeba #1647814', source: 'tatoeba' },
    { hanzi: '我最不喜欢数学。', pinyin: 'Wǒ zuì bù xǐhuan shùxué.', french: 'Ce sont les maths que j\'aime le moins.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #1889166', source: 'tatoeba' },
    { hanzi: '爱和被爱是最大的幸福。', pinyin: 'Ài hé bèi ài shì zuì dà de xìngfú.', french: 'Aimer et être aimé sont les plus grands des bonheurs.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #796807', source: 'tatoeba' },
  ],
  '左边': [
    { hanzi: '我坐在谢鹏左边。', pinyin: 'Wǒ zuò zài Xiè Péng zuǒbian.', french: 'Je suis assis à gauche de Xie Peng.', levelTier: 'Débutant', levelNumber: 1, contextNote: 'Création ChinoisLingo — validée par Espoir Chinois', source: 'generated' },
    { hanzi: '他的母亲坐在他的左边。', pinyin: 'Tā de mǔqīn zuò zài tā de zuǒbian.', french: 'Sa mère est assise à sa gauche.', levelTier: 'Intermédiaire', levelNumber: 2, contextNote: 'Tatoeba #616147', source: 'tatoeba' },
    { hanzi: '经过银行，左边就是他的办公室了。', pinyin: 'Jīngguò yínháng, zuǒbian jiù shì tā de bàngōngshì le.', french: 'Vous allez passer la banque et voilà son bureau à gauche.', levelTier: 'Avancé', levelNumber: 3, contextNote: 'Tatoeba #487705', source: 'tatoeba' },
  ],
};
