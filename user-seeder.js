var debug = require('debug')('webpractica:app');
var error = require('debug')('webpractica:app:error');
var mongoose = require('mongoose');

const User = require('./model/user');
const Cart = require('./model/cart');
const Product = require('./model/product');

var uri = 'mongodb://localhost/mydb';
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('connecting', function () {
    debug('Connecting to ', uri);
});
db.on('connected', function () {
    debug('Connected to ', uri);
});
db.on('disconnecting', function () {
    debug('Disconnecting from ', uri);
});
db.on('disconnected', function () {
    debug('Disconnected from ', uri);
});
db.on('error', function (err) {
    error('Error ', err.message);
});

mongoose.connect(uri, { useNewUrlParser: true })
    .catch(function (err) { error('Error', err.message); });

	
	
	// USER/CART VARIABLES
var users = [];
var usr = [];
var cartemp;
// PRODUCT VARIABLES
var catalog = [];
var products = [];

products[0] = new Product({
    name: 'Chihuahua',
    description: 'Small dog breed. In addition to being an adorable pet it is an intelligent, restless and curious companion who will offer all his love to those who take care of him. It come from Mexico.',
    price: 250,
    url: 'https://t1.ea.ltmcdn.com/es/images/8/2/2/img_adiestrar_a_un_chihuahua_20228_600.jpg',
    height: ' 15-35 cm',
	weight: ' 1-3 kg',
	physical: 'Recommended physical activity: Medium.',
    ideal: 'It is ideal for seniors and children',
    type:'animal companion',
	urls: ["/shop/images/chi1.jpg", "/shop/images/chi2.jpg", "/shop/images/chi3.jpg", "/shop/images/chi4.jpg", "/shop/images/chi5.jpg", "/shop/images/chi6.jpg"]
});
    
products[1] = new Product({
    name: 'Rottweiler',
    description: 'Strong, robust and athletic dog. Of medium to large size, and with an appearance that does not hide its great power. Undoubtedly the mere presence of these dogs commands respect and it is easy to be scared of such a powerful dog.',
    height: ' 55-70 cm.',
    weight: ' 45-100 kg.',
    physical: 'Recommended physical activity: Medium.',
    ideal: 'It is ideal for hiking, surveillance',
    price: 400,
    type:'animal companion',
    url: 'https://t2.ea.ltmcdn.com/es/images/3/0/8/img_adiestramiento_del_rottweiler_20803_600.jpg',
    urls: ["/shop/images/rot1.jpg", "/shop/images/rot2.jpg", "/shop/images/rot3.jpg", "/shop/images/rot4.jpg", "/shop/images/rot5.jpg", "/shop/images/rot6.jpg"]
});

products[2] = new Product({
    name:'Greyhounds',
    description:'Dogs quiet and peaceful, with a slender and refined figure, and a small size, being one of the 5 smallest dogs in the worl. Then are incredibly nimble and fast.',
    height:' 35-45 cm.',
    weight: ' 3-10 kg.', 
    physical:'Recommended physical activity: Medium.',
    ideal:'It is ideal for seniors, children and houses.',
    price:150,
    type:'animal companion',
    url:'https://upload.wikimedia.org/wikipedia/commons/3/3a/Galgo_Espa%C3%B1ol_hembra_02.jpg',
    urls:["/shop/images/gal1.jpg", "/shop/images/gal2.jpg", "/shop/images/gal3.jpg", "/shop/images/gal4.jpg", "/shop/images/gal5.jpg", "/shop/images/gal6.jpg"]
});

products[3] = new Product({
    name:'Caniche',
    description:' They are the most well-known dogs in the world, due to their elegance, intelligence and balanced character. They begin to gain popularity as companion dogs.',
    height:' 35-45 cm.',
    weight: ' 3-10 kg.', 
    physical:'Recommended physical activity: Medium.',
    ideal:'It is ideal for hunting, houses, therapy.',
    price:520,
    type:'animal companion',
    url:'https://upload.wikimedia.org/wikipedia/commons/f/f8/Full_attention_%288067543690%29.jpg',
    urls:["/shop/images/can1.jpg", "/shop/images/can2.jpg", "/shop/images/can3.jpg", "/shop/images/can4.jpg", "/shop/images/can5.jpg", "/shop/images/can6.jpg"]
});
products[4] = new Product({
    name:'Chow Chow',
    description:'This dogs is probably one of the most popular dog breeds originating in China around the world. It should be noted that the most distinctive feature of chow chow is the color of its tongue, which is blue.',
    height:' 45-50 cm.',
    weight: ' 25-45 kg.', 
    physical:'Recommended physical activity: Low.',
    ideal:'It is ideal for children, houses, surveillance.',
    price:630,
    type:'animal companion',
    url:'https://upload.wikimedia.org/wikipedia/commons/2/2c/01_Chow_Chow.jpg',
    urls:["/shop/images/cho1.jpg", "/shop/images/cho2.jpg", "/shop/images/cho3.jpg", "/shop/images/cho4.jpg", "/shop/images/cho5.jpg", "/shop/images/cho6.jpg"]
});
products[5] = new Product({
    name:'Mini Husky',
    description:'They are true stuffed animals, really adorable hairy balls that will not leave anyone indifferent. Has gained a lot of popularity in recent years.',
    height:' 55-70 cm.',
    weight: ' 23-10 kg.', 
    physical:'Recommended physical activity: Medium.',
    ideal:'It is ideal for houses.',
    price:455,
    type:'animal companion',
    url:'https://upload.wikimedia.org/wikipedia/commons/c/ca/Siberian-husky.jpg',
    urls:["/shop/images/hus1.jpg", "/shop/images/hus2.jpg", "/shop/images/hus3.jpg", "/shop/images/hus4.jpg", "/shop/images/hus5.jpg", "/shop/images/hus6.jpg"]
});

products.forEach(product => {
    catalog.push(product.save());
});


// GENERATING USERS
usr[0] = new User({
    name: 'Richard',
    surname: 'Watson',
    birth: '1998-02-11',
    address: 'Scotland Avenue, 76',
    email: 'richard.watson@uclm.es',
    password: 'richard'
});
cartemp = new Cart();
cartemp.save();
usr[0].cart = cartemp;
usr[0].password = usr[0].encryptPassword('richard');
users.push(usr[0].save());

usr[1] = new User({
    name: 'Emily',
    surname: 'McCarthy',
    birth: '2000-11-23',
    address: 'Downtown Street, 4',
    email: 'emily.mccarthy@uclm.es',
    password: 'emily'
});
cartemp = new Cart();
cartemp.save();
usr[1].cart = cartemp;
usr[1].password = usr[1].encryptPassword('emily');
users.push(usr[1].save());

usr[2] = new User({
    name: 'Rick',
    surname: 'Sánchez',
    birth: '1990-06-04',
    address: 'King Stronger, 150',
    email: 'rick.sanchez@uclm.es',
    password: 'rick'
});
cartemp = new Cart();
cartemp.save();
usr[2].cart = cartemp;
usr[2].password = usr[2].encryptPassword('rick');
users.push(usr[2].save());


Promise.all(catalog, users)
    .then(function () { 
        debug('Promise successful. Yay!!',
        '\n\t\tProducts added: ',catalog.length,
        '\n\t\tUsers added: ',users.length);
        mongoose.disconnect(); })