//Webex Bot Starter - featuring the webex-node-bot-framework - https://www.npmjs.com/package/webex-node-bot-framework

// FRAMEWORK REQUIRES
var framework = require('webex-node-bot-framework');
var webhook = require('webex-node-bot-framework/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(express.static('images'));
const config = require("./config.json");

// MODEL REQUIRES
const Product = require('./models/Product'); //require classes
const Survey = require('./models/Survey');
const SurveyQuestions = require('./models/SurveyQuestions');
const Feedback = require('./models/Feedback');
const Agenda = require('./models/Agenda');
const Report = require('./models/Report');
const Covid = require('./models/Covid');

// INIT FRAMEWORK START
var framework = new framework(config);
framework.start();
console.log("Starting framework, please wait...");

framework.on("initialized", function () {
  console.log("framework is all fired up! [Press CTRL-C to quit]");
});

// A spawn event is generated when the framework finds a space with your bot in it
// If actorId is set, it means that user has just added your bot to a new space
// If not, the framework has discovered your bot in an existing space
framework.on('spawn', (bot, id, actorId, trigger) => {
  // When actorId is present it means someone added your bot got added to a new space
  // Lets find out more about them..
  var msg1 = 'what do you want to do today? You can say `albert help` to get the list of words I am able to respond to.';
  bot.webex.people.get(actorId).then((user) => {
    msg1 = `Hello there ${user.displayName}. ${msg}`
    console.log("here? no way");
  }
  ).catch((e) => {
    //console.error(`Failed to lookup user details in framwork.on("spawn"): ${e.message}`);
    msg1 = `Hello, ${msg1}`;
  })
    //.then(() => { notifications(bot) })
    .finally(() => {
      // Say hello, and tell users what you do!
      if (bot.isDirect) {
        bot.say('markdown', msg1);
      } else {
        let botName = bot.person.displayName;
        msg1 += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@${botName}*.`;
        bot.say('markdown', msg1)
          .then(() => alberthelp(bot, trigger))
        
        
        //notifications(bot);
      }
    });

});
// INIT FRAMEWORK END

// FEATURES COMMANDS START (Process incoming messages)

let responded = false;
/* On mention with command
ex User enters @botname help, the bot will write back in markdown
*/



framework.hears('albert help', function (bot, trigger) {
  console.log(`someone needs help! They asked ${trigger.text}`);
  responded = true;
  bot.say(`Hello ${trigger.person.displayName}.`)
    .then(() => {
      alberthelp(bot)
      //bot.dm(trigger.person.id, managercmd(bot))
    })
    .catch((e) => console.error(`Problem in help hander: ${e.message}`));
});
// menu summary of commands end

/* On mention with command
ex User enters @botname framework, the bot will write back in markdown
*/

// FEATURE: PRODUCT SEARCH START///////////////////////////////////////
//product search to see how to store and retrieve from database

framework.hears(/add product/, function (bot, trigger) {
  console.log("someone asked for a card");
  responded = true;
  //funcaddprod(bot.sendCard(createproductcardJSON, 'This is customizable fallback text for clients that do not support buttons & cards'));
  bot.sendCard(createproductcardJSON, 'This is customizable fallback text for clients that do not support buttons & cards');

});

//figure out how to put input into name var
let createproductcardJSON =
{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.0",
  "body": [
    {
      "type": "ColumnSet",
      "columns": [
        {
          "type": "Column",
          "width": 2,
          "items": [
            {
              "type": "TextBlock",
              "text": "Add Product",
              "weight": "bolder",
              "size": "medium"
            },
            {
              "type": "TextBlock",
              "text": "Enter the details of the product you would like to add. Then click submit once you are done.",
              "isSubtle": true,
              "wrap": true
            },


            {
              "type": "TextBlock",
              "text": 'Product Code: ',
              "wrap": true
            },
            {
              "type": "Input.Number",
              "id": "prodcode", // put input in here without quotes (storing name as data in db rn)
              "placeholder": "eg. 1001"
            },


            {
              "type": "TextBlock",
              "text": "Product Title:",
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "prodtitle",
              "placeholder": "eg. Pen"
            },

            {
              "type": "TextBlock",
              "text": "Description",
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "proddesc",
              "placeholder": "eg. Red",

            },

            {
              "type": "TextBlock",
              "text": "Quantity:",
              "wrap": true
            },
            {
              "type": "Input.Number",
              "id": "prodquantity",
              "placeholder": "eg. 100",
            },

            {
              "type": "TextBlock",
              "text": "Price:",
              "wrap": true
            },
            {
              "type": "Input.Number",
              "id": "prodprice",
              "placeholder": "eg. 10.50",
            },
            {
              "type": "TextBlock",
              "text": "Notify at Low Quantity:",
              "wrap": true
            },
            {
              "type": "Input.Number",
              "id": "prodnotify",
              "placeholder": "eg. 5",
            },

          ]
        },

      ]
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Submit"
    }
  ]
}



framework.hears(/search/i, function (bot, trigger) {
  console.log("this is inside search.");
  responded = true;

  let botName = bot.person.displayName;
  searchmsg = `What product are you searching for? Please reply with product code. (eg. '1001'). \nDon't forget to *@${botName}* at the start of your response.`;
  bot.say('markdown', searchmsg)
    .then(() => searchcode(bot));
  //bot.reply(trigger.message);
});

function searchcode() {
  responded = true;
  framework.hears(/[1-9][0-9]/i, function (bot, trigger) {
    console.log("inside searchcode");
    responded = true;
    var usersearch = trigger.text
    var usersearchStr = JSON.stringify(usersearch)
    var usersearchObj = JSON.parse(usersearchStr)
    let newusersearchstr = usersearchObj.substring(7)
    //console.log("user search for: " + trigger.text + " ||" + newusersearchstr )
    responded = true;
    //bot.reply(trigger.message, 'Searching for product...','markdown');
    //read damn message input and write param inside where
    Product.findOne({
      where: {
        prodcode: newusersearchstr
      }, raw: true
    }).then((product) => {
      if (product) {
        bot.reply(trigger.message, "I found this product... \n \nProduct Code: " + product.prodcode +
          " \nTitle: " + product.prodtitle +
          " \nDescription: " + product.proddesc +
          " \nQuantity: " + product.prodquantity +
          " \nPrice: $" + product.prodprice.toFixed(2))
      } else {
        bot.reply("No record of product.")
      }
    }).catch(err => console.log(err));
  });
}


// FEATURE: PRODUCT SEARCH END///////////////////////////////////////

// TRY FEATURE: SURVEY QN START///////////////////////////////////////
framework.hears(/create survey/, function (bot, trigger) {
  console.log("survey qn card here");
  responded = true;
  //funcnewcard(bot.sendCard(newcardJSON,'This is customizable fallback text for clients that do not support buttons & cards'));
  bot.sendCard(surveyqnsCARD, 'This is customizable fallback text for clients that do not support buttons & cards')

});

let surveyqnsCARD =
{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.0",
  "body": [
    {
      "type": "ColumnSet",
      "columns": [
        {
          "type": "Column",
          "width": 2,
          "items": [
            {
              "type": "TextBlock",
              "text": "Create Survey",
              "weight": "bolder",
              "size": "medium"
            },
            {
              "type": "TextBlock",
              "text": "This survey is to be sent to your respective employees. Please input your questions you want to add into your survey.",
              "isSubtle": true,
              "wrap": true
            },


            {
              "type": "TextBlock",
              "text": 'Survey Code',
              "wrap": true
            },
            {
              "type": "Input.Number",
              "id": "scode", // put input in here without quotes (storing name as data in db rn)
              "placeholder": "Enter survey code here"
            },
            {
              "type": "TextBlock",
              "text": 'Title',
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "stitle", // put input in here without quotes (storing name as data in db rn)
              "placeholder": "Enter title here"
            },
            {
              "type": "TextBlock",
              "text": 'Description',
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "sdescription", // put input in here without quotes (storing name as data in db rn)
              "placeholder": "Enter description here"
            },
            {
              "type": "TextBlock",
              "text": "Question 1",
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "sqn1"
            },
            {
              "type": "TextBlock",
              "text": "Question 2",
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "sqn2",
            },
            {
              "type": "TextBlock",
              "text": "Question 3"
            },
            {
              "type": "Input.Text",
              "id": "sqn3"
            },
            {
              "type": "TextBlock",
              "text": "Question 4"
            },
            {
              "type": "Input.Text",
              "id": "sqn4"
            },
            {
              "type": "TextBlock",
              "text": "Question 5"
            },
            {
              "type": "Input.Text",
              "id": "sqn5"
            },

          ]
        },

      ]
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Submit",
      "id": "surveyqncardID"
    }
  ]
}



framework.hears(/send survey/, function (bot, trigger) {
  console.log("in sendsurvey");
  responded = true;
  let botName = bot.person.displayName; 
  surmsg = `Please enter the survey code that you want everyone to respond to. \nDon't forget to *@${botName}* at the start of your response.`;
  bot.say('markdown', surmsg)
    .then(() => newsurveycode());
  //.then(() => surveycode());

});

function newsurveycode() {
  responded = true;
  console.log("in newsurveycode here func")
  framework.hears(/[1-9][0-9]/i, function (bot, trigger) {
    console.log("in newsurveycode here")
    responded = true;
    var usersearch = trigger.text
    var usersearchStr = JSON.stringify(usersearch)
    var usersearchObj = JSON.parse(usersearchStr)
    let newusersearchstr = usersearchObj.substring(7)
    console.log("this here:" + newusersearchstr)
    //console.log("user search for: " + trigger.text + " ||" + newusersearchstr )
    responded = true;

    //add below here
    SurveyQuestions.findOne({
      where: {
        scode: newusersearchstr
      }, raw: true
    }).then((surveyquestions) => {
      //console.log("the code: " + surveyquestions + " | " + surveyquestions.scode)

      //@everyone here and send the survey out --> 

      if (surveyquestions) {
        // let ansename = trigger.person.displayName
        // let ansemail = trigger.person.emails[0]
        let ansscode = surveyquestions.scode
        let anstitle = surveyquestions.stitle
        let ansdescr = surveyquestions.sdescription
        let ansques1 = surveyquestions.sqn1
        let ansques2 = surveyquestions.sqn2
        let ansques3 = surveyquestions.sqn3
        let ansques4 = surveyquestions.sqn4
        let ansques5 = surveyquestions.sqn5
        bot.say("Hello everyone. Please respond to survey #" + ansscode + ". I will send it to your private message shortly.")
        //read everyone in room (say hi to everyone), then add below function inside the loop 
        //sendsurvey(bot, ansename, ansemail, ansscode, anstitle, ansdescr, ansques1, ansques2, ansques3, ansques4, ansques5)

        //get name and email by looping throguh everyone 
        bot.webex.memberships.list({ roomId: bot.room.id })
          .then((memberships) => {
            for (const member of memberships.items) {
              if (member.personId === bot.person.id) {
                // Skip myself!
                console.log("inside the forloop in survey")
                continue;
              }
              let ansename = (member.personDisplayName) ? member.personDisplayName : member.personEmail;
              let ansemail = (member.personEmail) ? member.personEmail : member.personDisplayName;
              //bot.say(`Hello ${ansename}, this is your email ${ansemail}.`)
              console.log(ansename, ansemail, ansscode, anstitle, ansdescr, ansques1, ansques2, ansques3, ansques4, ansques5)
              sendsurvey(bot, ansename, ansemail, ansscode, anstitle, ansdescr, ansques1, ansques2, ansques3, ansques4, ansques5)
            }
          })
          .catch((e) => {
            //console.error(`Call to sdk.memberships.get() failed: ${e.messages}`);
            bot.say('Hello everybody!');
          });




      } else {
        bot.say("Invalid survey code.")
      }

    }).catch(err => console.log(err));
  });
}


function sendsurvey(bot, ansename, ansemail, ansscode, anstitle, ansdescr, ansques1, ansques2, ansques3, ansques4, ansques5) {
  //let answersurCARD = {card}
  bot.dmCard(
    ansemail,
    {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.0",
      "body": [
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "width": 2,
              "items": [
                {
                  "type": "TextBlock",
                  "text": anstitle,
                  "weight": "bolder",
                  "size": "medium"
                },
                {
                  "type": "TextBlock",
                  "text": "Hello " + ansename,
                  "isSubtle": true,
                  "wrap": true
                },
                {
                  "type": "TextBlock",
                  "text": ansdescr + " (Survey Code: " + ansscode + ")",
                  "isSubtle": true,
                  "wrap": true
                },

                {
                  "type": "Input.Text",
                  "id": "aname", // put input in here without quotes (storing name as data in db rn)
                  "value": ansename,
                  "isVisible": false
                },
                {
                  "type": "Input.Number",
                  "id": "asurcode", // put input in here without quotes (storing name as data in db rn)
                  "value": ansscode,
                  "isVisible": false
                },
                {
                  "type": "Input.Text",
                  "id": "aemail", // put input in here without quotes (storing name as data in db rn)
                  "value": ansemail,
                  "isVisible": false
                },

                {
                  "type": "TextBlock",
                  "text": ansques1,
                  "wrap": true
                },
                {
                  "type": "Input.Text",
                  "id": "aq1", // put input in here without quotes (storing name as data in db rn)
                  "placeholder": "Enter your answer here"
                },
                {
                  "type": "TextBlock",
                  "text": ansques2,
                  "wrap": true
                },
                {
                  "type": "Input.Text",
                  "id": "aq2", // put input in here without quotes (storing name as data in db rn)
                  "placeholder": "Enter your answer here"
                },
                {
                  "type": "TextBlock",
                  "text": ansques3,
                  "wrap": true
                },
                {
                  "type": "Input.Text",
                  "id": "aq3", // put input in here without quotes (storing name as data in db rn)
                  "placeholder": "Enter your answer here"
                }, {
                  "type": "TextBlock",
                  "text": ansques4,
                  "wrap": true
                },
                {
                  "type": "Input.Text",
                  "id": "aq4", // put input in here without quotes (storing name as data in db rn)
                  "placeholder": "Enter your answer here"
                },
                {
                  "type": "TextBlock",
                  "text": ansques5,
                  "wrap": true
                },
                {
                  "type": "Input.Text",
                  "id": "aq5", // put input in here without quotes (storing name as data in db rn)
                  "placeholder": "Enter your answer here"
                },

              ]
            },

          ]
        }
      ],
      "actions": [
        {
          "type": "Action.Submit",
          "title": "Submit",
          "id": "surveyqncardID"
        }
      ]
    }
  )
}

framework.hears(/survey responses/i, function (bot, trigger) {
  console.log("this is inside surveyresponse.");
  responded = true;

  let botName = bot.person.displayName;
  surveymsg = `Enter the survey code of the responses that you want to retrieve.  \nDon't forget to *@${botName}* at the start of your response.`;
  bot.say('markdown', surveymsg)
  
    .then(() => getsurvey(bot));
  //bot.reply(trigger.message);
});


function getsurvey() {
  responded = true;
  console.log("this is inside getsurvey func.");
  framework.hears(/[1-9][0-9]/i, function (bot, trigger) {
    console.log("inside getsurvey");
    responded = true;
    var usersurvey = trigger.text
    var usersurveyStr = JSON.stringify(usersurvey)
    var usersurveyObj = JSON.parse(usersurveyStr)
    let newusersurveystr = usersurveyObj.substring(7)
    //console.log("user search for: " + trigger.text + " ||" + newusersearchstr )
    responded = true;
    //bot.reply(trigger.message, 'Searching for product...','markdown');
    //read damn message input and write param inside where
    Survey.findAll({
      where: {
        asurcode: newusersurveystr
      }, raw: true
    }).then((survey) => {

      console.log("in survey then")
      survey.forEach(surveyobj => {
        console.log("inresponse forloop")
        if (surveyobj.asurcode != null) {
          console.log("inresponse notnull")
          console.log("survey: " + survey)
          console.log("surveyobj: " + surveyobj + " , " + surveyobj.asurcode)

          //i++ //increment message is a dog
          //let fbresponsemsg = `**RESPONSE:**`;
          let usersurveystr = "Respondent: " + surveyobj.aname + " (" + surveyobj.aemail + ")" +
            " \nAnswers for..." +
            " \nQ1. " + surveyobj.aq1 +
            " \nQ2. " + surveyobj.aq2 +
            " \nQ3. " + surveyobj.aq3 +
            " \nQ4. " + surveyobj.aq4 +
            " \nQ5. " + surveyobj.aq5
          bot.say("RESPONSE: " + usersurveystr);
        } else {
          console.log("inresponse else")
          bot.say("No responses for survey #" + newusersearchstr + " yet.");
        }
      })
    }).catch(err => console.log(err));
  });

}



// TRY FEATURE: SURVEY QN END///////////////////////////////////////

// FEATURE: FEEDBACK START ///////////////////////////////////////
framework.hears('feedback', function (bot, trigger, actorId) {
  //call feedback function to trigger
  console.log("in feedback");
  responded = true;
  let botName = bot.person.displayName;
  msg1 = `Hello! You can tell us anything regarding your satisfaction at work. Don't worry, your feedback will be kept anonymous. \nDon't forget to *@${botName}* and say **fbanswer** at the start of your response.`;
  bot.say('markdown', msg1)
  // working?????
});

framework.hears(/fbanswer/, function (bot, trigger) {
  // then write feedback response here 
  console.log("inside fbanswer")
  responded = true;
  var fbresponse = trigger.text
  var fbresponseStr = JSON.stringify(fbresponse)
  var fbresponseObj = JSON.parse(fbresponseStr)
  console.log("ANSWER: " + fbresponseObj)

  var newdate = new Date()
  var datestr = JSON.stringify(newdate)
  var dateObj = JSON.parse(datestr)
  let cutdate = dateObj.substring(0,10)
  Feedback.create({ 
    fbdate: cutdate,
    fbresponse: fbresponseObj
  }).then(() => {
    console.log("feedback in db")
    bot.say("Thank you for your response! We will review it soon and take it to consideration.")
  })
});

framework.hears(/get feedbacks/, function (bot, trigger) {
  //see all the feedback given
  console.log("inside seefeedback")
  //bot.say("List of feedbacks...")
  responded = true;
  Feedback.findAll({
    where: {},
    raw: true,
  }).then((feedback) => {
    //var i = 0
    console.log("inresponse then")
    feedback.forEach(feedbackobj => {
      console.log("inresponse forloop")
      if (feedbackobj.fbresponse != null) {
        console.log("inresponse notnull")
        //i++ //increment message is a dog
        //let fbresponsemsg = `**RESPONSE:**`;
        let newstr = (feedbackobj.fbresponse).substring(16)
        bot.say("RESPONSE ON " + feedbackobj.fbdate + ": "+ newstr);
      } 
      // else {
      //   console.log("inresponse else")
      //   bot.say("No feedbacks yet.");
      // }
    })
  }).catch(err => console.log(err));
});
// FEATURE: FEEDBACK END ///////////////////////////////////////



// FEATURE: NOTIFICATIONS START ////////////////////////////////

// function notifications(bot) {
// console.log("inside notif func")
framework.hears(/low stock/, function (bot, trigger) {
  responded = true;
  Product.findAll({
    where: {},
    raw: true,
  }).then((product) => {
    //productlist.push(product)
    //console.log("outside notifs if: " + product) //this is printing both objects below dk which one to call 
    product.forEach(prodobj => {
      //var count = 0
      //console.log("--------------test for each--------------")
      //this is sending message for
      if (prodobj.prodquantity < prodobj.prodnotify) {
        bot.say("Item " + prodobj.prodtitle + " is low in stock. Product code #" + prodobj.prodcode + " (" + prodobj.prodquantity + " items left)")

      }
      //console.log("count: " + count)
    });
  }).catch(err => console.log(err));
});
// }


//DONT DELETE (this iterates through each key/value in object dict)
//for ( const [key,value] of Object.entries(prodobj)) {
//console.log("key: " + key + " || value: " + value + " || retrieves value of key: " +prodobj.prodquantity )
//}

// FEATURE: NOTIFICATIONS END ////////////////////////////////

// FEATURE: AGENDA START ////////////////////////////////
framework.hears(/set tasks/, function (bot, trigger) {
  console.log("some1 called for create tasks");
  responded = true;
  let email = trigger.person.emails[0];
  let thedate = new Date();
  bot.say(`Sending ${trigger.person.displayName} a card privately.`)
    .then(() =>dmAgenda(bot, email, thedate))
    .catch((e) => console.error(`Problem in help hander: ${e.message}`));
});
function dmAgenda(bot, email, thedate){
  var newdate = new Date()
  var datestr = JSON.stringify(newdate)
  var dateObj = JSON.parse(datestr)
  let cutdate = dateObj.substring(0,10)
  console.log("cutdate: " + cutdate + ", " + datestr)
  bot.dmCard(
    email,
    {
      "type": "AdaptiveCard",
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "version": "1.2",
      "body": [
        {
          "type": "TextBlock",
          "text": cutdate +"'s Tasks",
          "wrap": true,
          "weight": "bolder",
          "size": "medium"
      },
      {
          "type": "Input.Text", //store date without showing on card (cannot edit)
          "id": "today",
          "value": cutdate,
          "isVisible": false
         
      },
          {
              "type": "TextBox",
              "text": "Please Enter the Tasks For Today:",
              "wrap": true
          },
          {
              "type": "Input.Text",
              "id": "agenda1",
              "placeholder": "e.g finish all excels"
             
          }
      ],
      "actions": [
          {
              "type": "Action.Submit",
              "title": "Submit",
              "wrap": "true"
          },
          {
              "type": "Action.ShowCard",
              "title": "Add Tasks",
              "card": {
                  "type": "AdaptiveCard",
                  "body": [
                      {
                          "type": "Input.Text",
                          "id": "agenda2",
                          "placeholder": "Please Enter a Task"
                      }
                  ],
                  "actions": [
                      {
                          "type": "Action.Submit",
                          "title": "Submit"
                      },
                      {
                          "type": "Action.ShowCard",
                          "title": "Add Tasks",
                          "card": {
                              "type": "AdaptiveCard",
                              "body": [
                                  {
                                      "type": "Input.Text",
                                      "id": "agenda3",
                                      "placeholder": "Enter a Task"
                                  }
                              ],
                              "actions": [
                                  {
                                      "type": "Action.Submit",
                                      "title": "Submit"
                                  }
                              ]
                          }
                      }
                  ]
              }
          }
      ]
    },
        "This is the fallback text if the client can't render this card");
    }
     

framework.hears(/get tasks/, function (bot, trigger) {
  responded = true;

  var newdate = new Date()
  var datestr = JSON.stringify(newdate)
  var dateObj = JSON.parse(datestr)
  let cutdate = dateObj.substring(0,10)
  console.log("the date: " + cutdate)
  Agenda.findOne({
    where: {today: cutdate},
    raw:true,
  }).then((tasks) => {
    if(tasks.agenda2 == null) { 
      bot.say("Here are the tasks for today")
      let a1 = tasks.agenda1
      firsttaskcard(bot, a1 )
      
    } else if(tasks.agenda3 == null) { 
      bot.say("Here are the tasks for today")
      let a1 = tasks.agenda1
      let a2 = tasks.agenda2
      secondtaskcard(bot, a1, a2)
    } else if(tasks.agenda3 != null) { 
      bot.say("Here are the tasks for today")
      let a1 = tasks.agenda1
      let a2 = tasks.agenda2
      let a3 = tasks.agenda3
      thirdtaskcard(bot, a1, a2, a3)
      
    } 
    else{
      bot.say("There are no tasks for the day.")
    }
  }).catch(err => console.log(err));

});



function firsttaskcard(bot, a1) {

  let firstcard =
  {
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.2",
    "body": [
      {
        "type": "TextBlock",
        "text": a1,
        "wrap": true,
      },

    ]
  }
  bot.sendCard(firstcard, "bruh")
}

function secondtaskcard(bot, a1, a2) {

  let secondcard =
  {
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.2",
    "body": [
      {
        "type": "TextBlock",
        "text": "1. " + a1,
        "wrap": true,
      },
      {
        "type": "TextBlock",
        "text": "2. " + a2,
        "wrap": true,
      },

    ]
  }
  bot.sendCard(secondcard, "bruh")
}

function thirdtaskcard(bot, a1, a2, a3) {

  let thirdcard =
  {
    "type": "AdaptiveCard",
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.2",
    "body": [
      {
        "type": "TextBlock",
        "text": "1. " + a1,
        "wrap": true,
      },
      {
        "type": "TextBlock",
        "text": "2. " + a2,
        "wrap": true,
      },
      {
        "type": "TextBlock",
        "text": "3. " + a3,
        "wrap": true,
      },

    ]
  }
  bot.sendCard(thirdcard, "bruh")
}

// FEATURE: MANAGEMENT - AGENDA END ////////////////////////////////

// FEATURE: MANAGEMENT - WEATHER START ////////////////////////////////

framework.hears('weather', function(bot,trigger){
  console.log("called for weather real af lol");    
  responded = true;
  bot.sendCard(Wcard, 'what wld u do?')
  });
 
let Wcard =
{
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "1.0",
  "backgroundImage": "https://messagecardplayground.azurewebsites.net/assets/Mostly%20Cloudy-Background.jpg",
  "body": [
    {
      "type": "ColumnSet",
      "columns": [
        {
          "type": "Column",
          "width": "35",
          "items": [
            {
              "type": "Image",
              "url": "https://messagecardplayground.azurewebsites.net/assets/Mostly%20Cloudy-Square.png",
              "size": "stretch",
              "altText": "Mostly cloudy weather"
            }
          ]
        },
        {
          "type": "Column",
          "width": "65",
          "items": [
            {
              "type": "TextBlock",
              "text": "Thursday, May 26, 2022", ///////////////////change the date lololololol
              "weight": "bolder",
              "size": "large",
              "wrap": true
            },
            {
              "type": "TextBlock",
              "text": "32 / 50",
              "size": "medium",
              "spacing": "none",
              "wrap": true
            },
            {
              "type": "TextBlock",
              "text": "31% chance of rain",
              "spacing": "none",
              "wrap": true
            },
            {
              "type": "TextBlock",
              "text": "Winds 4.4 mph SSE",
              "spacing": "none",
              "wrap": true
            }
          ]
        }
      ]
    },
    {
      "type": "ColumnSet",
      "columns": [
        {
          "type": "Column",
          "width": "20",
          "items": [
            {
              "type": "TextBlock",
              "horizontalAlignment": "center",
              "wrap": true,
              "text": "Wednesday"
            },
            {
              "type": "Image",
              "size": "auto",
              "url": "https://messagecardplayground.azurewebsites.net/assets/Drizzle-Square.png",
              "altText": "Drizzly weather"
            },
            {
              "type": "FactSet",
              "horizontalAlignment": "right",
              "facts": [
                {
                  "title": "High",
                  "value": "50"
                },
                {
                  "title": "Low",
                  "value": "32"
                }
              ]
            }
          ],
          "selectAction": {
            "type": "Action.OpenUrl",
            "title": "View Wednesday",
            "url": "https://www.microsoft.com"
          }
        },
        {
          "type": "Column",
          "width": "20",
          "items": [
            {
              "type": "TextBlock",
              "horizontalAlignment": "center",
              "wrap": true,
              "text": "Thursday"
            },
            {
              "type": "Image",
              "size": "auto",
              "url": "https://messagecardplayground.azurewebsites.net/assets/Mostly%20Cloudy-Square.png",
              "altText": "Mostly cloudy weather"
            },
            {
              "type": "FactSet",
              "facts": [
                {
                  "title": "High",
                  "value": "50"
                },
                {
                  "title": "Low",
                  "value": "32"
                }
              ]
            }
          ],
          "selectAction": {
            "type": "Action.OpenUrl",
            "title": "View Thursday",
            "url": "https://www.microsoft.com"
          }
        },
        {
          "type": "Column",
          "width": "20",
          "items": [
            {
              "type": "TextBlock",
              "horizontalAlignment": "center",
              "wrap": true,
              "text": "Friday"
            },
            {
              "type": "Image",
              "size": "auto",
              "url": "https://messagecardplayground.azurewebsites.net/assets/Mostly%20Cloudy-Square.png",
              "altText": "Mostly cloudy weather"
            },
            {
              "type": "FactSet",
              "facts": [
                {
                  "title": "High",
                  "value": "59"
                },
                {
                  "title": "Low",
                  "value": "32"
                }
              ]
            }
          ],
          "selectAction": {
            "type": "Action.OpenUrl",
            "title": "View Friday",
            "url": "https://www.microsoft.com"
          }
        },
        {
          "type": "Column",
          "width": "20",
          "items": [
            {
              "type": "TextBlock",
              "horizontalAlignment": "center",
              "wrap": true,
              "text": "Saturday"
            },
            {
              "type": "Image",
              "size": "auto",
              "url": "https://messagecardplayground.azurewebsites.net/assets/Mostly%20Cloudy-Square.png",
              "altText": "Mostly cloudy weather"
            },
            {
              "type": "FactSet",
              "facts": [
                {
                  "title": "High",
                  "value": "50"
                },
                {
                  "title": "Low",
                  "value": "32"
                }
              ]
            }
          ],
          "selectAction": {
            "type": "Action.OpenUrl",
            "title": "View Saturday",
            "url": "https://www.microsoft.com"
          }
        }
      ]
    }
  ]
}

//FEATURE: MANAGEMENT - WEATHER END ////////////////////////////////
//FEATURE: MANAGEMENT - COVID DOSE START ///////////////////////
framework.hears('vaccination status', function (bot, trigger) {
  console.log("called for vaccine card");
  responded = true;
  var covidname = trigger.person.displayName
  covidcard(bot,covidname)
});
function covidcard(bot,covidname){
  let covid = 
  {
    "type": "AdaptiveCard",
    "body": [
      {
        "type": "TextBlock",
        "text": "Vaccination Status",
        "size": "large"
      },
      {
 
        "type": "TextBlock",
        "text": "Hello, " + covidname + ". Have you taken vaccine dose 1?",
        "placeholder": "Please enter Yes or No",
      },
      {
 
        "type": "Input.Text",
        "id": "covidguy",
        "value": covidname,
        "isVisible": false
      },
      {
 
        "type": "Input.Text",
        "placeholder": "Please enter Yes or No",
        "id": "dose1"
      }
    ],
    "actions": [
      {
        "type": "Action.Submit",
        "title": "Submit"
      },
      {
        "type": "Action.ShowCard",
        "title": "Add field",
        "card": {
          "type": "AdaptiveCard",
          "body": [
            {
              "type": "Input.Text",
              "placeholder": "Dose 2",
              "id": "dose2"
            }
          ],
          "actions": [
            {
              "type": "Action.Submit",
              "title": "Submit"
            },
            {
              "type": "Action.ShowCard",
              "title": "Add field",
              "card": {
                "type": "AdaptiveCard",
                "body": [
                  {
                    "type": "Input.Text",
                    "placeholder": "Dose 3",
                    "id": "dose3"
                  }
                ],
                "actions": [
                  {
                    "type": "Action.Submit",
                    "title": "Submit"
                  },
                  {
                    "type": "Action.ShowCard",
                    "title": "Add field",
                    "card": {
                      "type": "AdaptiveCard",
                      "body": [
                        {
                          "type": "Input.Text",
                          "placeholder": "Extra Booster 4",
                          "id": "dose4"
                        }
                      ],
                      "actions": [
                        {
                          "type": "Action.Submit",
                          "title": "Submit"
                        },
                      ],
                      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
                    }
                  }
                ],
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
              }
            }
          ],
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
        }
      }
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.0"
  }
  bot.sendCard(covid, 'what wld u do?')
}
  
framework.hears('get status', function (bot, trigger) {
  console.log("called for get status");
  responded = true;
  //bot.say("Printing out all Status now.....")
  Covid.findAll({
    where: {},
    raw: true,
  }).then((covid) => {
    console.log("before for loop")
    covid.forEach(covidobj => {
      if (covidobj.covidguy != null) {
        console.log("after for loop")
        if (covidobj.dose2 == null) {
          console.log("in dose 1")
          bot.say(covidobj.covidguy + " dose..." + "\n1. " + covidobj.dose1)
        } else if (covidobj.dose3 == null) {
          console.log("in dose 2")
          bot.say(covidobj.covidguy + " dose..." + "\n1. " + covidobj.dose1 + "\n2. " + covidobj.dose2)
        } else if (covidobj.dose4 == null) {
          console.log("in dose 3")
          bot.say(covidobj.covidguy + " dose..." + "\n1. " + covidobj.dose1 + "\n2. " + covidobj.dose2 + "\n3. " + covidobj.dose3)
        } else if (covidobj.dose4 != null) {
          console.log("in dose 4")
          bot.say(covidobj.covidguy + " dose..." + "\n1. " + covidobj.dose1 + "\n2. " + covidobj.dose2 + "\n3. " + covidobj.dose3 + "\n4. " + covidobj.dose4)
        } else {
          //reponded = true;
          console.log("in covid else")
          bot.say("No incidents reported.");
        }
    } 
    
    // else {
    //   console.log("in this Covid else")
    //   bot.say("No incidents reported.");
    // }
    })
  }).catch(err => console.log(err));
  
});



//FEATURE: MANAGEMENT - COVID END ////////////////////////////////
//FEATURE: MANAGEMENT - REPORT START ////////////////////////////////

framework.hears('report', function (bot, trigger) {
  console.log("called for report card");
  responded = true;
  var reportname = trigger.person.displayName
  reportcard(bot, reportname)
});
 
function reportcard(bot, reportname) { 

  let report =
  {
    "type": "AdaptiveCard",
    "body": [
      {
        "type": "TextBlock",
        "text": "Incident Report",
        "size": "large"
      },
      {
 
        "type": "TextBlock",
        "text": "Hello, " + reportname + ". Do you want to report something?",
        "placeholder": "Please enter something",
      },
      {
 
        "type": "Input.Text",
        "id": "reportguy",
        "value": reportname,
        "isVisible": false
      },
      {
 
        "type": "Input.Text",
        "placeholder": "Please enter something",
        "id": "report1"
      }
    ],
    "actions": [
      {
        "type": "Action.Submit",
        "title": "Submit"
      },
      {
        "type": "Action.ShowCard",
        "title": "Add field",
        "card": {
          "type": "AdaptiveCard",
          "body": [
            {
              "type": "Input.Text",
              "placeholder": "Placeholder 2",
              "id": "report2"
            }
          ],
          "actions": [
            {
              "type": "Action.Submit",
              "title": "Submit"
            },
            {
              "type": "Action.ShowCard",
              "title": "Add field",
              "card": {
                "type": "AdaptiveCard",
                "body": [
                  {
                    "type": "Input.Text",
                    "placeholder": "Placeholder 3",
                    "id": "report3"
                  }
                ],
                "actions": [
                  {
                    "type": "Action.Submit",
                    "title": "Submit"
                  },
                  {
                    "type": "Action.ShowCard",
                    "title": "Add field",
                    "card": {
                      "type": "AdaptiveCard",
                      "body": [
                        {
                          "type": "Input.Text",
                          "placeholder": "Placeholder 4",
                          "id": "report4"
                        }
                      ],
                      "actions": [
                        {
                          "type": "Action.Submit",
                          "title": "Submit"
                        },
                      ],
                      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
                    }
                  }
                ],
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
              }
            }
          ],
          "$schema": "http://adaptivecards.io/schemas/adaptive-card.json"
        }
      }
    ],
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "version": "1.0"
  }
  bot.sendCard(report, 'what wld u do?')
}


framework.hears('get reports', function (bot, trigger) {
  console.log("called for get reports");
  responded = true;
  //bot.say("Printing out all reports now.....")
  Report.findAll({
    where: {},
    raw: true,
  }).then((report) => {
    console.log("before for loop")
    report.forEach(reportobj => {
      if (reportobj.reportguy != null) {
        console.log("after for loop")
        if (reportobj.report2 == null) {
          console.log("in report 1")
          bot.say(reportobj.reportguy + " report..." + "\n1. " + reportobj.report1)
        } else if (reportobj.report3 == null) {
          console.log("in report 2")
          bot.say(reportobj.reportguy + " report..." + "\n1. " + reportobj.report1 + "\n2. " + reportobj.report2)
        } else if (reportobj.report4 == null) {
          console.log("in report 3")
          bot.say(reportobj.reportguy + " report..." + "\n1. " + reportobj.report1 + "\n2. " + reportobj.report2 + "\n3. " + reportobj.report3)
        } else if (reportobj.report4 != null) {
          console.log("in report 4")
          bot.say(reportobj.reportguy + " report..." + "\n1. " + reportobj.report1 + "\n2. " + reportobj.report2 + "\n3. " + reportobj.report3 + "\n4. " + reportobj.report4)
        } else {
          //reponded = true;
          console.log("in report else")
          bot.say("No incidents reported.");
        }
    } 
    // else {
    //   console.log("in this report else")
    //   bot.say("No incidents reported.");
    // }
    })
  }).catch(err => console.log(err));
});



//FEATURE: MANAGEMENT - REPORT END ////////////////////////////////


//////////////////////////////// ATTACHMENT ACTION ////////////////////////////////

framework.on('attachmentAction', function (bot, trigger) {
  // bot.say(`Got an attachmentAction:\n${JSON.stringify(trigger.attachmentAction,null,2)}`);///
  // if (cardid = "newcardID") {
  bot.reply(trigger.attachmentAction, 'Your response has been recorded.');
  console.log("someone submitted a survey");
  var response = trigger.attachmentAction
  var responseStr = JSON.stringify(response)
  var responseObj = JSON.parse(responseStr)
  var responseInput = responseObj.inputs
  // console.log(responseInput)
  Survey.create(responseInput).then((survey) => {
    console.log("survey in db");
    //console.log("parTy pOoper is staNcey");
  })
  Product.create(responseInput).then((product) => {
    console.log("product in db");
  })
  SurveyQuestions.create(responseInput).then((surveyqn) => {
    console.log("survey questions in db");
  })
  Agenda.create(responseInput).then((agenda) => {
    console.log("agenda in db");
  })
  Report.create(responseInput).then((report) => {
    console.log("report in db");
  })
  Covid.create(responseInput).then((covid) => {
    console.log("covid in db");
  })
  // } 
});

//////////////////////////////// ATTACHMENT ACTION ////////////////////////////////


// FEATURE: MAINMENU / HELPBOT START ////////////////////////////////

framework.hears(/.*/, function (bot, trigger) {
  // This will fire for any input so only respond if we haven't already
  if (!responded) {
    console.log(`catch-all handler fired for user input: ${trigger.text}`);
    bot.say(`Sorry, I don't know how to respond to "${trigger.text}"`)
      //.then(() => sendHelp(bot))
      .then(() => {
        alberthelp(bot)
        //bot.dm(trigger.person.id, managercmd(bot))
      })
      .catch((e) => console.error(`Problem in the unexepected command hander: ${e.message}`));
  }
  responded = false;
});

function alberthelp(bot, trigger) {
  console.log("INSIDE MAIN MENU FUNCTION");
  bot.say("markdown", 'I can help you... ', '\n\n ' +
    '1. **get tasks**   (Get your daily tasks for the day) \n' +
    '2. **feedback**   (Leave a feedback to your manager) \n' +
    '3. **search**   (Search for product details) \n' +
    '4. **low stock**   (Check what products are low in stock) \n' +
    '5. **report**   (Report an incident) \n' +
    '6. **weather**   (Check for the weather) \n' +
    '7. **vaccination status**   (Input your vaccination status) \n' +
    '8. **albert help**   (What you see now)  \n' +
    '9. **Login** (Log in as a manager)'
  );

  bot.say("markdown", 'As a manager, you can... ', '\n\n ' +
    '1. **set tasks**   (Set daily tasks for the day for your staff) \n' +
    '2. **add product**   (Add a new product) \n' +
    '3. **create survey**   (Create a survey) \n' +
    '4. **send survey**   (Notify your staff and send a survey to them) \n' +
    '5. **survey responses**   (See the survey responses) \n' +
    '6. **get feedbacks**   (Get feedbacks submitted by your staff) \n' +
    '7. **get reports**   (See incident reports submitted by your staff) \n' +
    '8. **get status**   (See vaccination status submitted by your staff) \n' +
    '9. **albert help**   (What you see now)'
  );
  // var mgremail = trigger.person.emails[0]
  //bot.dm(trigger.person.id, managercmd(bot))
}



// FEATURE: MAINMENU / HELPBOT END ////////////////////////////////

/////////////////////// SERVER START /////////////////////// 
//Server config & housekeeping
// Health Check
app.get('/', function (req, res) {
  res.send(`I'm alive.`);
});

app.post('/', webhook(framework));

var server = app.listen(config.port, function () {
  framework.debug('framework listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function () {
  framework.debug('stoppping...');
  server.close();
  framework.stop().then(function () {
    process.exit();
  });
});
/////////////////////// SERVER END /////////////////////// 

/////////////////////// DB START (like app.js) /////////////////////// 

// db requires
const MySQLStore = require('express-mysql-session');
const db = require('./config/db'); // db.js config file
const cookieParser = require('cookie-parser');
const fypDB = require('./config/DBConnection'); // Bring in database connection
const { getDefaultSettings } = require('http2');
const Bit = require('tedious/lib/data-types/bit');
const { get } = require('express/lib/response');
const { report } = require('process');
const { covid } = require('process');

//SQL EXPORT?? 
// const mysql = require('mysql');
// const excel = require('exceljs');

const session = require('express-session')({
  key: 'fyp_session',
  secret: 'tojiv',
  store: new MySQLStore({
    host: db.host,
    port: 3306,
    user: db.username,
    password: db.password,
    database: db.database,
    clearExpired: true,
    // How frequently expired sessions will be cleared; milliseconds:
    checkExpirationInterval: 9000000,
    // The maximum age of a valid session; milliseconds:
    expiration: 9000000,
  }),
  resave: false,
  saveUninitialized: false,
});
//const sharedsession = require("express-socket.io-session");

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser);
// app.use(passport.authenticate('RememberMe'));

// To store session information. By default it is stored as a cookie on browser
// so the cookie works here alrdy so how shld i "deactivate" it LOLOLOLOLOLOL 
app.use(session);

// Connects to MySQL database
fypDB.setUpDB(false); // To set up database with new tables set (true)



