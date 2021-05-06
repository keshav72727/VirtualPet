var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feed;
var lastFed;

//create feed and lastFed variable here


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happyDog.png");
}

function setup() {
  
  createCanvas(1000,400);
  database = firebase.database();
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock,showError);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feed = createButton("Feed The Dog");
  feed.position(500,95);
  feed.mousePressed(feedDog);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
 var fedTime = database.ref('FeedTime');
  fedTime.on("value",function (data){
    lastFed = data.val();
  })
 
  //write code to display text lastFed time here
  if (lastFed >= 12){
    textSize(20);
    fill("red");
    text("Last Feed : "+lastFed%12 +" PM",100,100);
  }
  else if (lastFed == 0){
    textSize(20);
    fill("red");
    text(" Last Feed : 12 AM",100,100);
  }
  else{
    textSize(20);
    fill("red");
    text(" Last Feed : "+lastFed + "AM",100,100);
  }
  
  
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var food_stock = foodObj.getFoodStock();
  if (food_stock <= 0){
   foodObj.updateFoodStock(food_stock*0);
  }
  else{
    foodObj.updateFoodStock(food_stock-1);
  }

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function showError(){
  console.log("error writting in database");
}