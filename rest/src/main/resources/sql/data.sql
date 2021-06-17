--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'ivvo98@gmail.com','admin','2021-06-13 12:00:31','$2a$10$a1D8tbySCpkl09ldFQ8amu.rjUN0eOTU9MFKV.eh.tkZTffsnu7G.'),(2,'coca.cola@cchellenic.com','Coca Cola','2021-06-13 12:03:55','$2a$10$IyTCt5bK.EUFHOdE5x9.7uXabu9H8wEoxCFgAu5nfZacdcPm.UyE.'),(3,'bgoffice@adidas.com','Adidas','2021-06-13 12:07:49','$2a$10$LEg3rLKVB/i9Q3C8IdA8bOA5eHwtsbPCyd.fdHmuo1n8PuU15avY6'),(4,'nivea.sofia@beiersdorf.com','Nivea','2021-06-13 12:22:04','$2a$10$t48j3ozrFpXtu.Br//YiReu.pHKqbeETe8f7oS1mZUFl6lXo3cOZK'),(5,'rolex@besha.bg','Rolex','2021-06-13 13:57:47','$2a$10$RPiHqUnH8ldVtwHkbnoDbOw/wBQ2Zcw58zX91EgQffhoc2.35Vfc6'),(6,'bgsamsung@fds.com','Samsung','2021-06-13 13:59:46','$2a$10$sgktYQUXrB6xZmp5NAaF5OHVD0sw3KkYI40HmYukM/4BREfcicC7u'),(7,'kenzo@mail.com','Kenzo','2021-06-13 14:01:00','$2a$10$I.oN0NgtfumicD.94s4os.bbk2ROlzoeYSFwc1CqN2DCjnJi.1Sqq'),(8,'suppus@optimumnutrition.com','Optimum Nutrition','2021-06-13 14:02:25','$2a$10$OIoYBjVCeeZmUgKO7ngoBONFj4usp.Y.nXqv8I.YT3ztgFS24PRBS'),(9,'tefal@mail.com','Tefal','2021-06-13 14:03:59','$2a$10$LMmJ5wRyDDYVZHv9qIW62.wYF8ttXEFnmlXzl7O3C71axT3OmON8e'),(10,'info@matracinani.bg','НАНИ','2021-06-13 14:05:15','$2a$10$ErZw43j2nCoXcyUslupYd.Whu7in6ferplyLTr/6xu.lgic8XDNNO'),(11,'inxc23fo@me3kd923xon.bg','Medix','2021-06-13 14:06:19','$2a$10$nutKtKAPdPlmGlgiFII6sO5VVTqX6N1gFKKMC2eCSxcof8dUXyzz2'),(12,'office@vistaawt.com','Colgate','2021-06-13 14:07:15','$2a$10$RJ4otaUBV73.QjJQ0wcyjuazKF/9Ee6csHtRu9d61vDwJ3XIlnQuO'),(13,'office@slantcho.com','Слънчо','2021-06-13 14:08:23','$2a$10$nLLx34wT4xen915QG.9MMeYM239hnsruT3.Ny0mzxCqSa1uqTFYTO'),(14,'Lighting@philips.com','Philips','2021-06-13 14:09:30','$2a$10$yLBShd/91yLdttRylAcFLubHQtzEIFszaCP32kmMYsJJanOuDMikC'),(15,'mercury@mpp.bg','Меркурий','2021-06-13 14:10:25','$2a$10$9k1DNYiPOgTNEKhtFSGAEelbK1X2dJ3URc60e1N8KuMk8vJ9S4g4u'),(16,'bgconsumer@krafteurope.com','Milka','2021-06-13 14:11:25','$2a$10$UmumSgdrLmZiC/3nAT474O0f0d1bjEQi6gPYziDkAia1dS2PuqqrG'),(17,'nestle.bulgaria@bg.nestle.com','Nestle','2021-06-13 14:12:49','$2a$10$gCY1m0ydpl3eusz4m/DZ5ONp/MTqRQfwV9u/5/XTftm2CGZaVEga6');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'ADMIN'),(2,'EMPLOYER');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,1),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),(17,2);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cloudinary_resource`
--

LOCK TABLES `cloudinary_resource` WRITE;
/*!40000 ALTER TABLE `cloudinary_resource` DISABLE KEYS */;
INSERT INTO `cloudinary_resource` VALUES ('a7dpafmzbnepgiewj03y','2021-06-13 14:02:23','png','image',5551,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582143/a7dpafmzbnepgiewj03y.png'),('ay7kz2bzgahhgpn4zs9x','2021-06-13 14:00:58','png','image',38959,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582058/ay7kz2bzgahhgpn4zs9x.png'),('cye8bipjqcr8iamjbdyi','2021-06-13 14:32:31','png','image',801183,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623583951/cye8bipjqcr8iamjbdyi.png'),('cyvsfvwht60r17qtsban','2021-06-13 14:09:28','jpg','image',101813,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582568/cyvsfvwht60r17qtsban.jpg'),('dhfvcsq4jtkpuzwvftb3','2021-06-13 13:57:45','png','image',37081,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623581865/dhfvcsq4jtkpuzwvftb3.png'),('dldi3xhs1n9b99jxwmtg','2021-06-13 14:48:53','jpg','image',23429,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623584933/dldi3xhs1n9b99jxwmtg.jpg'),('efnfpbeedzij4g7aktdr','2021-06-13 14:12:47','png','image',15585,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582767/efnfpbeedzij4g7aktdr.png'),('etouqwhvvsloaletzazn','2021-06-13 14:03:57','png','image',481273,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582237/etouqwhvvsloaletzazn.png'),('f9j0yju047of2tn3xja2','2021-06-13 14:11:21','svg','image',10639,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582681/f9j0yju047of2tn3xja2.svg'),('h5mgssfhkrvtqgvhsmkq','2021-06-13 14:06:17','png','image',4028,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582377/h5mgssfhkrvtqgvhsmkq.png'),('iux1hvngxxiylx94rgqy','2021-06-13 14:50:13','jpg','image',749996,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623585013/iux1hvngxxiylx94rgqy.jpg'),('jd9qyhby8zlevu89odqy','2021-06-13 14:05:13','png','image',123357,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582313/jd9qyhby8zlevu89odqy.png'),('kbndsgjld78mxizhjxbk','2021-06-13 14:08:21','jpg','image',11148,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582501/kbndsgjld78mxizhjxbk.jpg'),('kgswt38hucusjecan1sx','2021-06-13 14:47:43','jpg','image',161986,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623584863/kgswt38hucusjecan1sx.jpg'),('kn8zitzpanpit6j4xn9l','2021-06-13 14:10:23','png','image',73378,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582623/kn8zitzpanpit6j4xn9l.png'),('m7ldusqb3cnvhy2yps9x','2021-06-13 14:30:43','jpg','image',131965,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623583843/m7ldusqb3cnvhy2yps9x.jpg'),('mgpvm7wdqmzkygdtynfi','2021-06-13 12:03:52','jpg','image',18736,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623575032/mgpvm7wdqmzkygdtynfi.jpg'),('nbqrumusko8v7l1r3mij','2021-06-13 12:07:47','jpg','image',9039,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623575267/nbqrumusko8v7l1r3mij.jpg'),('pfeelixnxpnkdriy8wwn','2021-06-13 12:22:00','svg','image',1307,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623576120/pfeelixnxpnkdriy8wwn.svg'),('q7uermakpj6yheuiensf','2021-06-13 14:33:22','jpg','image',40882,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623584002/q7uermakpj6yheuiensf.jpg'),('qxa0t2wxsqoknbcxszbm','2021-06-13 14:39:27','jpg','image',44741,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623584367/qxa0t2wxsqoknbcxszbm.jpg'),('rbi2ii7ko8iw7yvxywf8','2021-06-13 14:07:13','png','image',39537,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623582433/rbi2ii7ko8iw7yvxywf8.png'),('re15ub9brnwvzup87zqf','2021-06-13 14:46:37','jpg','image',40399,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623584797/re15ub9brnwvzup87zqf.jpg'),('rq1xohyhuosycyjkxjfz','2021-06-13 14:40:54','jpg','image',24799,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623584454/rq1xohyhuosycyjkxjfz.jpg'),('snov1t1gyuewduqsafvl','2021-06-13 14:31:43','jpg','image',97045,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623583903/snov1t1gyuewduqsafvl.jpg'),('tqosdy4kbpj1p1fihhd3','2021-06-13 13:59:43','png','image',32959,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623581983/tqosdy4kbpj1p1fihhd3.png'),('xfgbsjzhuhxil1naoqp6','2021-06-13 14:42:23','jpg','image',41890,'http://res.cloudinary.com/dbeoyblgx/image/upload/v1623584543/xfgbsjzhuhxil1naoqp6.jpg');
/*!40000 ALTER TABLE `cloudinary_resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (2,360,'mgpvm7wdqmzkygdtynfi','1965-07-07 02:00:00','Световна компания създадена през 1895 г. в Калифорния, произвеждаща напитки. Най-известната от които е Кока Кола. В България се произвежда от 1965 г.',3200000.00,'0700 17 117','ALLOWED','2021-06-13 14:16:55','София'),(3,745,'nbqrumusko8v7l1r3mij','1980-10-23 02:00:00','Най-големият в света производител на спортни стоки. Седалището на фирмата продължава да е в Германия, докато производството отдавна е изнесено в други части на света, основно в Азия.',2470000.00,'02 811 42 00','ALLOWED','2021-06-13 14:16:57','София'),(4,200,'pfeelixnxpnkdriy8wwn','2000-03-15 02:00:00','Международна компания за производство на козметични продукти от натурални съставки.  Характеризира се с бързо разрастваща се търговия.',430540.00,'2 9231600','ALLOWED','2021-06-13 14:17:02','София'),(5,124,'dhfvcsq4jtkpuzwvftb3','1995-05-09 03:00:00','Производител на часовници, регистрирана в Женева, Швейцария. Компанията е създадена през 1905 г. Произвежда високо качество луксозни часовници, чиято цена варира между $6500 и $75 000',546000.00,'02 981 38 70','ALLOWED','2021-06-13 14:17:06','София'),(6,854,'tqosdy4kbpj1p1fihhd3','2005-02-23 02:00:00','На световния пазар е известен като производител на високотехнологични компоненти, телекомуникационно оборудване. Главният офис на компанията е разположен в Сеул.',4320000.00,'03265347','ALLOWED','2021-06-13 14:17:09','Пловдив'),(7,98,'ay7kz2bzgahhgpn4zs9x','2003-06-11 03:00:00','Kenzo е френска луксозна модна къща, основана през 1970 г. от японския дизайнер Kenzo Takada и собственост на компанията-майка LVMH.',5400000.00,'0898466525','ALLOWED','2021-06-13 14:17:16','Варна'),(8,65,'a7dpafmzbnepgiewj03y','2018-06-12 03:00:00','Компания произвежда  спортни хранителни добавки с продукти във всяка категория - протеинови барове, протеинови напитки, RTD спортни напитки, витамини, минерали или билки за оптимално хранене.',123000.00,'0897654221','ALLOWED','2021-06-13 14:17:39','Габрово'),(9,123,'etouqwhvvsloaletzazn','1999-06-16 03:00:00','Основният производствен обект на Tefal предоставя 45 милиона нови бройки всяка година и се намира в Rumilly, Франция. Известна с патентоването на „тигана с незалепващо покритие“ през 1954 г.',378000.00,'0896543444','ALLOWED','2021-06-13 14:17:43','Стара Загора'),(10,45,'jd9qyhby8zlevu89odqy','2000-07-13 03:00:00','Водеща компания в България с над 15-годишен опит в производството и дистрибуцията на матраци, и над 20 годишен опит с производство и дистрибуция на мебели и материали за мебелното производство.',46000.00,'0800 40 100','ALLOWED','2021-06-13 14:17:52','Севлиево'),(11,665,'h5mgssfhkrvtqgvhsmkq','2001-06-12 03:00:00','Вече над 20 години МЕКСОН ООД е с безспорна лидерска позиция на българския пазар. Със своя дългогодишен опит и професионализъм в сферата на битовата химия, компанията е символ и гаранция за качество и безупречна чистота.',650000.00,'032 502 009','ALLOWED','2021-06-13 14:17:56','Пловдив'),(12,332,'rbi2ii7ko8iw7yvxywf8','2013-10-16 03:00:00','Американска компания, производител на сапуни, почистващи препарати, паста за зъби, четки за зъби, както и на ветеринарни продукти.',740000.00,'02 421 59 21','ALLOWED','2021-06-13 14:18:00','София'),(13,43,'kbndsgjld78mxizhjxbk','1979-06-13 02:00:00','„Слънчо” АД е производител на детски каши на зърнена основа, детски пюрета, сокчета и нектари, пшенични пръчици и зърнени храни.',87000.00,'0631/ 6 01 65','UNRESOLVED',NULL,'Свищов'),(14,233,'cyvsfvwht60r17qtsban','1998-06-17 03:00:00','Нидерландска компания, която е сред най-големите световни производители на електроника.',27000.00,'2/489 99 96','BLOCKED','2021-06-13 14:17:28','София'),(15,56,'kn8zitzpanpit6j4xn9l','1992-05-12 03:00:00','Фирма за пакетиране и продажба на подправки от цял свят. Поддържа голям асортимент на продукти.',45000.00,'066/804 436','UNRESOLVED',NULL,'Габрово'),(16,112,'f9j0yju047of2tn3xja2','1999-06-17 03:00:00','Milka е марка шоколадови изделия, която от 2012 г. се произвежда от Mondelez International. Освен характерния лилав цвят и лого, марката има добре и познат символ-талисман – лилава крава, с бели шарки и бяла глава.',335000.00,'02 910 11','UNRESOLVED',NULL,'София'),(17,314,'efnfpbeedzij4g7aktdr','2003-06-11 03:00:00','Мултинационална компания със седалище във Вьове, Швейцария, за производство на хранителни продукти, безалкохолни напитки и др., основана през 1866 г.',139000.00,'02 9390 333','BLOCKED','2021-06-13 14:17:48','София');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ad`
--

LOCK TABLES `ad` WRITE;
/*!40000 ALTER TABLE `ad` DISABLE KEYS */;
INSERT INTO `ad` VALUES (1,'2021-06-13 14:30:45',_binary '\0',NULL,5000,NULL,50.00,'Предлага великолепен фюжън от вкусове и аромати с ниско съдържание на калории. На българския пазар премиум марката включва 4 вкуса.','Fuzetea','2021-09-12',2,'m7ldusqb3cnvhy2yps9x'),(2,'2021-06-13 14:31:45',_binary '\0',NULL,NULL,NULL,43.00,'Свежа газирана напитка с вкус на лимон и лайм. На българския пазар е от 1992 г. Освежаващият и ярък вкус го нарежда сред предпочитаните напитки в над 190 държави.','Sprite','2021-11-30',2,'snov1t1gyuewduqsafvl'),(3,'2021-06-13 14:32:33',_binary '\0',NULL,3000,NULL,60.00,'Хубавото време идва със страхотния тропически вкус на новата Fanta. Искряща, дръзка и още по-вкусна!','Fanta','2021-10-23',2,'cye8bipjqcr8iamjbdyi'),(4,'2021-06-13 14:33:24',_binary '\0',NULL,2000,NULL,54.00,'Освежителна напитка без подсладители и предназначена за спортуващи.','Schweppes','2021-12-12',2,'q7uermakpj6yheuiensf'),(5,'2021-06-13 14:39:30',_binary '\0',40,4000,73,120.00,'Произведени от естествена кожа с дишашаща основа и подплатени със силиконови продукти.','Маратонки Adidas','2021-08-27',3,'qxa0t2wxsqoknbcxszbm'),(6,'2021-06-13 14:40:57',_binary '\0',54,500,200,100.00,'Произведена от памучна материя с ръчно изработена щампа.','Тениска Adidas','2021-09-09',3,'rq1xohyhuosycyjkxjfz'),(7,'2021-06-13 14:42:25',_binary '\0',NULL,400,NULL,60.00,'Изработена от естествена кожа, с много подразделения.','Чанта Adidas','2021-08-24',3,'xfgbsjzhuhxil1naoqp6'),(8,'2021-06-13 14:46:40',_binary '\0',30,1000,100,54.00,'Универсален хидратиращ крем с меко въздействие.','Крем Nivea','2021-08-23',4,'re15ub9brnwvzup87zqf'),(9,'2021-06-13 14:47:45',_binary '\0',NULL,300,NULL,39.00,'Универсален продукт с натурални продукти без остатъчни субстанции.','Шампоан Nivea','2021-12-14',4,'kgswt38hucusjecan1sx'),(10,'2021-06-13 14:48:55',_binary '\0',12,240,50,58.00,'Мек натурален сапун, съставен от извлек на маточина и лайка.','Сапун Nivea','2021-11-30',4,'dldi3xhs1n9b99jxwmtg'),(11,'2021-06-13 14:50:15',_binary '\0',NULL,3000,NULL,100.00,'Освежаващ дезодорант, предназначен за спортисти със силно физичесто натоварване.','Дезодорант Nivea','2021-08-12',4,'iux1hvngxxiylx94rgqy');
/*!40000 ALTER TABLE `ad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ad_application`
--

LOCK TABLES `ad_application` WRITE;
/*!40000 ALTER TABLE `ad_application` DISABLE KEYS */;
/*!40000 ALTER TABLE `ad_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ad_rating`
--

LOCK TABLES `ad_rating` WRITE;
/*!40000 ALTER TABLE `ad_rating` DISABLE KEYS */;
/*!40000 ALTER TABLE `ad_rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `characteristic`
--

LOCK TABLES `characteristic` WRITE;
/*!40000 ALTER TABLE `characteristic` DISABLE KEYS */;
INSERT INTO `characteristic` VALUES (1,'Консумация','Силно охладено!',1),(2,'Размер','37, 38, 39',5),(3,'Цвят','Черни, Сини',5),(4,'Размер','XXL',6),(5,'Цвят','Черен, Червен',6),(6,'Материя','Памук',6),(7,'Кожа','Естествена',7),(8,'Цвят','Черен, Син',7),(9,'Против','Бръчки, Напукана кожа',8),(10,'Ароман','Вишня, Лимон, Череша',10),(11,'Пол','Мъжки',11),(12,'Количество','200мл',11);
/*!40000 ALTER TABLE `characteristic` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `youtuber`
--

LOCK TABLES `youtuber` WRITE;
/*!40000 ALTER TABLE `youtuber` DISABLE KEYS */;
/*!40000 ALTER TABLE `youtuber` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-13 14:50:56
