/* A deliberately fictional, internally consistent demonstration catalog. */
window.TQ = {};
TQ.brands = [
  {name:'BOSCH',slug:'bosch',country:'Германия',specialty:'Электрика и фильтры'},
  {name:'Brembo',slug:'brembo',country:'Италия',specialty:'Тормозные системы'},
  {name:'KYB',slug:'kyb',country:'Япония',specialty:'Амортизаторы и подвеска'},
  {name:'MANN-FILTER',slug:'mann',country:'Германия',specialty:'Системы фильтрации'},
  {name:'SACHS',slug:'sachs',country:'Германия',specialty:'Подвеска и сцепление'},
  {name:'SKF',slug:'skf',country:'Швеция',specialty:'Подшипники и ступицы'},
  {name:'ATE',slug:'ate',country:'Германия',specialty:'Тормозные системы'},
  {name:'TRW',slug:'trw',country:'Германия',specialty:'Подвеска и тормоза'},
  {name:'Original BMW',slug:'bmw',country:'Германия',specialty:'Оригинальные детали'}
];
TQ.categories = [
  {id:'suspension',name:'Подвеска',image:'strut',sub:['Амортизаторы','Рычаги подвески','Пружины','Опоры и подшипники']},
  {id:'brakes',name:'Тормозная система',image:'brake',sub:['Тормозные диски','Тормозные колодки','Суппорты','Датчики износа']},
  {id:'engine',name:'Двигатель',image:'engine',sub:['Система ГРМ','Прокладки','Охлаждение','Опоры двигателя']},
  {id:'filters',name:'Фильтры',image:'filter',sub:['Масляные фильтры','Воздушные фильтры','Салонные фильтры','Топливные фильтры']},
  {id:'electric',name:'Электрика',image:'electric',sub:['Генераторы','Стартеры','Датчики','Свечи зажигания']},
  {id:'transmission',name:'Трансмиссия',image:'transmission',sub:['Сцепление','Приводные валы','ШРУСы','Опоры КПП']},
  {id:'body',name:'Кузов и оптика',image:'body',sub:['Передние фары','Задние фонари','Зеркала','Детали кузова']},
  {id:'steering',name:'Рулевое управление',image:'steering',sub:['Рулевые рейки','Рулевые тяги','Наконечники','Насосы ГУР']},
  {id:'accessories',name:'Инструменты и аксессуары',image:null,sub:['Инструменты','Уход за автомобилем','Аксессуары']}
];
TQ.cars = [
  {id:'bmw',make:'BMW',model:'3 Series G20',badge:'320i G20',year:'2022',engine:'2.0 B48',vin:'DEMBM320G20220001'},
  {id:'audi',make:'Audi',model:'A4 B9',badge:'A4 B9',year:'2021',engine:'2.0 TFSI',vin:'DEMAUD4B920210001'},
  {id:'mercedes',make:'Mercedes-Benz',model:'C-Class W206',badge:'C-Class W206',year:'2023',engine:'1.5 M254',vin:''},
  {id:'toyota',make:'Toyota',model:'Camry XV70',badge:'Camry XV70',year:'2020',engine:'2.5 A25A',vin:''},
  {id:'vw',make:'Volkswagen',model:'Golf VII',badge:'Golf VII',year:'2018',engine:'1.4 TSI',vin:''},
  {id:'tiguan',make:'Volkswagen',model:'Tiguan II',badge:'Tiguan II',year:'2021',engine:'2.0 TSI',vin:''}
];
// Synthetic VINs are 17 characters and are NOT registrations of real cars.
TQ.demoVIN = 'DEM0BMWG202200001';
TQ.clarifyVIN = 'DEM0AUD4B92021001';
TQ.cars[0].vin=TQ.demoVIN;
TQ.cars[1].vin=TQ.clarifyVIN;
const productRows = [
  [1,'KYB','Амортизатор передний',8490,'suspension','strut','Газовый · передняя ось',1,['bmw','vw'],'front','both','gas'],
  [2,'SACHS','Амортизатор передний',9290,'suspension','strut','Газовый · передняя ось',2,['bmw'],'front','both','gas'],
  [3,'Brembo','Диск тормозной передний',6790,'brakes','brake','Вентилируемый · Ø 330 мм',1,['bmw'],'front','both','vented'],
  [4,'MANN-FILTER','Фильтр масляный',1290,'filters','filter','Картридж · высота 105 мм',1,null,'none','both','paper'],
  [5,'TRW','Рычаг подвески передний',7490,'suspension','arm','Передняя ось · левый',2,['bmw','audi'],'front','left','metal'],
  [6,'SKF','Рычаг подвески передний',8690,'suspension','arm','Передняя ось · правый',3,['audi'],'front','right','metal'],
  [7,'SACHS','Амортизатор задний',5990,'suspension','strut','Газовый · задняя ось',1,['bmw','vw'],'rear','both','gas'],
  [8,'KYB','Амортизатор задний',6290,'suspension','strut','Газовый · задняя ось',4,['toyota'],'rear','both','gas'],
  [9,'BOSCH','Генератор',18900,'electric','electric','14 В · 180 А',2,['bmw'],'none','both','metal'],
  [10,'SACHS','Диск сцепления',11900,'transmission','transmission','Диаметр 240 мм',3,['vw'],'none','both','metal'],
  [11,'ATE','Диск тормозной передний',7190,'brakes','brake','Вентилируемый · Ø 330 мм',2,['bmw'],'front','both','vented'],
  [12,'Original BMW','Диск тормозной передний',14900,'brakes','brake','Вентилируемый · Ø 330 мм',4,['bmw'],'front','both','vented'],
  [13,'BOSCH','Фара передняя',24800,'body','body','Светодиодная · правая',3,['audi'],'front','right','led'],
  [14,'TRW','Рулевая рейка',32900,'steering','steering','Электрическая · в сборе',5,['bmw'],'front','both','metal'],
  [15,'BOSCH','Двигатель в сборе',249000,'engine','engine','2.0 л · демонстрационный образец',7,null,'none','both','metal'],
  [16,'BOSCH','Фильтр масляный',990,'filters','filter','Картридж · высота 105 мм',2,['audi'],'none','both','paper'],
  [17,'KYB','Стойка амортизационная',10490,'suspension','strut','Газовый · передняя ось',2,['mercedes'],'front','left','gas'],
  [18,'SACHS','Стойка амортизационная',11290,'suspension','strut','Газовый · передняя ось',3,['tiguan'],'front','right','gas']
];
TQ.products=productRows.map(r=>({id:r[0],brand:r[1],name:r[2],price:r[3],category:r[4],image:r[5],params:r[6],days:r[7],cars:r[8],axis:r[9],side:r[10],type:r[11],sku:`TQ-DEMO-${String(r[0]).padStart(3,'0')}`,oem:`DEMO-OEM-${r[4]==='brakes'?'330':String(r[0]).padStart(3,'0')}`,stock:r[0]!==15,unit:'шт.'}));
TQ.product=id=>TQ.products.find(p=>p.id===Number(id));
TQ.category=id=>TQ.categories.find(c=>c.id===id);
