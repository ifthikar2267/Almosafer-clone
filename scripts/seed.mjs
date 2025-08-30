import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // to read from .env file

const uri = process.env.MONGO_URI; // your Atlas URI
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("almosafer_clone");
    const collection = db.collection("post");

    const result = await collection.insertMany([
    {
	"title" : "Hilton Istanbul Bomonti Hotel & Conference Center",
	"city" : "Istanbul",
	"country" : "Turkey",
	"location" : "Silahsor Card.No: 42 Bomonti Sisli ",
	"countryCode" : "TR",
	"star" : 4,
	"images" : [ "https://cf.bstatic.com/xdata/images/hotel/max1024x768/483737377.jpg?k=ef1dbd7edee820fd65efbb6b0bb0b99885690b78e41142787e15fae71f0b3fcd&o=&hp=1", "https://www.kayak.co.in/rimg/himg/b8/21/29/ice-705924-99707341-613859.jpg?width=1366&height=768&crop=true", "https://images.trvl-media.com/lodging/7000000/6230000/6226800/6226720/93c7e76c.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill", "https://www.hilton.com/im/en/ISTBHHI/10929877/1st-image-2-.jpg?impolicy=crop&cw=3750&ch=2500&gravity=NorthWest&xposition=625&yposition=0&rw=1280&rh=854", "https://www.hilton.com/im/en/ISTBHHI/4701638/outdoor-pool-2.jpg?impolicy=crop&cw=5537&ch=3100&gravity=NorthWest&xposition=0&yposition=331&rw=768&rh=430" ],
	"price" : 751
},


{
	"title" : "Wyndham Grand Levent Istanbul Hotel & Conference Center",
	"city" : "Istanbul",
	"country" : "Turkey",
	"location" : "Esentepe Mahallesi",
	"countryCode" : "TR",
	"star" : 5,
	"images" : [ "https://cf.bstatic.com/xdata/images/hotel/max1024x768/304587070.jpg?k=3982757baa04024d8803bfb18859f1be9b75f99e5f54bccb110ef45438483596&o=&hp=1", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/18/48/b7/96/wyndham-grand-istanbul.jpg?w=900&h=-1&s=1", "https://cf.bstatic.com/xdata/images/hotel/max1024x768/639852489.jpg?k=08f881f8e55da486ee33edc2ced19be9fbdc2f5ae524208cc8dffd30ed235645&o=&hp=1", "https://foto.hrsstatic.com/fotos/0/2/800/458/80/000000/http%3A%2F%2Ffoto-origin.hrsstatic.com%2Ffoto%2FMTS%2F657613%2F657613_z34_9254053_21.jpg/ih05Gxu2ncoOJU8AVbdTHg==/1500,1030/6/WYNDHAM_GRAND_ISTANBUL_LEVENT_HOTEL_CONFERENCE_CENTER-Istanbul-Double_room_superior-1-657613.jpg", "https://images.trvl-media.com/lodging/9000000/8230000/8224200/8224155/bf91932e.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill" ],
	"price" : 762
},
{
	"title" : "Clarion Hotel Golden Horn",
	"city" : "Istanbul",
	"country" : "Turkey",
	"location" : "Imrahor Caddesi Sivaseli No:10 ",
	"countryCode" : "TR",
	"star" : 4,
	"images" : [ "https://reemtravel.com.tr/uploads/1698498103_2fec9c1b1490479672e1.jpg", "https://cf.bstatic.com/xdata/images/hotel/max1024x768/253371459.jpg?k=968922727ff53d367001c2578fce4d6271a1c01b42a1e65db8166bfb7bad8347&o=&hp=1", "https://cf.bstatic.com/xdata/images/hotel/max1024x768/612422083.jpg?k=f632b3459c5f87aa2776c1ef10c9eeb79eb6cabed672de51f5c0e0a4ac0ad9c3&o=&hp=1", "https://q-xx.bstatic.com/xdata/images/hotel/max500/504103485.jpg?k=3d804b645404e1da545b974b275a30d948b0a47f1caf060f1a2145db7184f998&o=", "https://media.licdn.com/dms/image/v2/C4D1BAQHL09VDr6g6vg/company-background_10000/company-background_10000/0/1583408438203/clariongoldenhorn_cover?e=2147483647&v=beta&t=ydnTsqgb1If9DSxniBycl1oP0TjK5XvqMnMb_3_Vfl0" ],
	"price" : 404
},
{
	"title" : "Radisson Blu Hotel, Istanbul Sisli",
	"city" : "Istanbul",
	"country" : "Turkey",
	"location" : "19 Mayis Card.No 2 Sisli ",
	"countryCode" : "TR",
	"star" : 5,
	"images" : [ "https://www.istanbulairporttaxis.com/images/urunler/big/MTVlMzFlZGQwNWRkYWI.jpg", "https://www.kayak.co.in/rimg/himg/7b/89/35/ice-697118-103511600-080565.jpg?width=1366&height=768&crop=true", "https://media.radissonhotels.net/image/radisson-blu-hotel-istanbul-sisli/lobby/16256-116529-f64515954_4K.jpg?impolicy=HomeHero", "https://pix10.agoda.net/property/848723/331888453/7c005f67dfdb535463d5c27317783876.jpeg?ce=0&s=414x232", "https://media.radissonhotels.net/image/radisson-blu-hotel-istanbul-sisli/restaurant/16256-116529-f64515088_3xl.jpg?impolicy=Card" ],
	"price" : 687
},
{
	"title" : "Address Istanbul",
	"city" : "Istanbul",
	"country" : "Turkey",
	"location" : "Unalan Mah. Libadiye Card.No:82F, G Blok ",
	"countryCode" : "TR",
	"star" : 5,
	"images" : [ "https://images.trvl-media.com/lodging/69000000/68280000/68277500/68277409/33d714fc.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill", "https://static.travelclick.com/assets/hotel/114094/media/room/detail-image/deluxe_room_city_view_enhanced.jpg", "https://images.trvl-media.com/lodging/69000000/68280000/68277500/68277409/dc9e9466.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill", "https://images.trvl-media.com/lodging/69000000/68280000/68277500/68277409/f8dcc435.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill", "https://cf.bstatic.com/xdata/images/hotel/max1024x768/340148916.jpg?k=bbf2da08ff8110aa500a25c3cb443aaaeb95fdcc5c26eb3e84b47adf373ea229&o=&hp=1" ],
	"price" : 755
}
    ]);

    console.log(`Inserted ${result.insertedCount} documents`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
