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
const CovidQuestions = require('./models/CovidQuestions');
const Password = require('./models/Password')

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
  var msg1 = ' I am Edward';
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
        //msg1 += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@${botName}*.`;
        bot.say('markdown', msg1)
          .then(() => workerhelp(bot, trigger))
        
        
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



// framework.hears(/3/i, function (bot, trigger) {
//   console.log("this is inside search.");
//   responded = true;

//   let botName = bot.person.displayName;
//   searchmsg1 = `What product are you searching for? Please reply with product code. (eg. '1001'). \nDon't forget to *@${botName}* at the start of your response.`;
//   bot.say('markdown', searchmsg1)
//     .then(() => searchcode(bot));
//   //bot.reply(trigger.message);
// });

// function searchcode() {
//   responded = true;
//   framework.hears(/""/i, function (bot, trigger) {
//     console.log("inside searchcode");
//     responded = true;
//     var eusersearch = trigger.text
//     var eusersearchStr = JSON.stringify(eusersearch)
//     var eusersearchObj = JSON.parse(eusersearchStr)
//     let enewusersearchstr = eusersearchObj.substring(7)
//     //console.log("user search for: " + trigger.text + " ||" + newusersearchstr )
//     responded = true;
//     //bot.reply(trigger.message, 'Searching for product...','markdown');
//     //read damn message input and write param inside where
//     Product.findOne({
//       where: {
//         prodcode: enewusersearchstr
//       }, raw: true
//     }).then((product) => {
//       if (product) {
//         bot.reply(trigger.message, "I found this product... \n \nProduct Code: " + product.prodcode +
//           " \nTitle: " + product.prodtitle +
//           " \nDescription: " + product.proddesc +
//           " \nQuantity: " + product.prodquantity +
//           " \nPrice: $" + product.prodprice.toFixed(2))
//       } else {
//         bot.reply("No record of product.")
//       }
//     }).catch(err => console.log(err));
//   });
// }


// FEATURE: PRODUCT SEARCH END///////////////////////////////////////

// TRY FEATURE: SURVEY QN START///////////////////////////////////////
framework.hears(/m3/, function (bot, trigger) {
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



framework.hears(/m4/, function (bot, trigger) {
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

framework.hears(/m5/i, function (bot, trigger) {
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
framework.hears('2', function (bot, trigger, actorId) {
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
framework.hears(/4/, function (bot, trigger) {
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
     

framework.hears(/1/, function (bot, trigger) {
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

framework.hears('6', function(bot,trigger){
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
              "text": "Singapore", ///////////////////change the date lololololol
              "weight": "bolder",
              "size": "large",
              "wrap": true
            },
            {
              "type": "TextBlock",
              "text": "Wednesday, Aug 18, 2022", ///////////////////change the date lololololol
              "weight": "bolder",
              "size": "large",
              "wrap": true
            },
            {
              "type": "TextBlock",
              "text": "32 / 28",
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
              "text": "Thursday"
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
                  "value": "32"
                },
                {
                  "title": "Low",
                  "value": "27"
                }
              ]
            }
          ],
          "selectAction": {
            "type": "Action.OpenUrl",
            "title": "View Saturday",
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
                  "value": "30"
                },
                {
                  "title": "Low",
                  "value": "27"
                }
              ]
            }
          ],
          "selectAction": {
            "type": "Action.OpenUrl",
            "title": "View Sunday",
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
                  "value": "31"
                },
                {
                  "title": "Low",
                  "value": "26"
                }
              ]
            }
          ],
          "selectAction": {
            "type": "Action.OpenUrl",
            "title": "View Tuesday",
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
              "text": "Sunday"
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
                  "value": "32"
                },
                {
                  "title": "Low",
                  "value": "27"
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
framework.hears(/create vaccination survey/, function (bot, trigger) {
  console.log("covid survey qn card here");
  responded = true;
  //funcnewcard(bot.sendCard(newcardJSON,'This is customizable fallback text for clients that do not support buttons & cards'));
  bot.sendCard(covidqnsCARD, 'This is customizable fallback text for clients that do not support buttons & cards')

});

let covidqnsCARD =
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
              "text": "Create Vaccination Status Check",
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
              "id": "ccode", // put input in here without quotes (storing name as data in db rn)
              "placeholder": "Enter survey code here"
            },
            {
              "type": "TextBlock",
              "text": 'Title',
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "ctitle", // put input in here without quotes (storing name as data in db rn)
              "placeholder": "Enter title here"
            },
            {
              "type": "TextBlock",
              "text": 'Description',
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "cdescription", // put input in here without quotes (storing name as data in db rn)
              "placeholder": "Enter description here"
            },
            {
              "type": "TextBlock",
              "text": "Question 1",
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "cqn1"
            },
            {
              "type": "TextBlock",
              "text": "Question 2",
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "cqn2",
            },
            {
              "type": "TextBlock",
              "text": "Question 3"
            },
            {
              "type": "Input.Text",
              "id": "cqn3"
            },
            {
              "type": "TextBlock",
              "text": "Question 4"
            },
            {
              "type": "Input.Text",
              "id": "cqn4"
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
      "id": "covidqncardID"
    }
  ]
}



framework.hears(/send vaccination survey/, function (bot, trigger) {
  console.log("in sendcovidsurvey");
  responded = true;
  let botName = bot.person.displayName; 
  surmsg = `Please enter the survey code that you want everyone to respond to. \nDon't forget to *@${botName}* at the start of your response.`;
  bot.say('markdown', surmsg)
    .then(() => newcovidcode());
  //.then(() => surveycode());

});

function newcovidcode() {
  responded = true;
  console.log("in newcovidcode here func")
  framework.hears(/[1-9][0-9]/i, function (bot, trigger) {
    console.log("in newcovidcode here")
    responded = true;
    var usercovidsearch = trigger.text
    var usercovidsearchStr = JSON.stringify(usercovidsearch)
    var usercovidsearchObj = JSON.parse(usercovidsearchStr)
    let newusercovidsearchstr = usercovidsearchObj.substring(7)
    console.log("this here:" + newusercovidsearchstr)
    //console.log("user search for: " + trigger.text + " ||" + newusersearchstr )
    responded = true;

    //add below here
    CovidQuestions.findOne({
      where: {
        ccode: newusercovidsearchstr
      }, raw: true
    }).then((covidquestions) => {
      //console.log("the code: " + surveyquestions + " | " + surveyquestions.scode)

      //@everyone here and send the survey out --> 

      if (covidquestions) {
        // let ansename = trigger.person.displayName
        // let ansemail = trigger.person.emails[0]
        let ancscode = covidquestions.ccode
        let anctitle = covidquestions.ctitle
        let ancdescr = covidquestions.cdescription
        let ancques1 = covidquestions.cqn1
        let ancques2 = covidquestions.cqn2
        let ancques3 = covidquestions.cqn3
        let ancques4 = covidquestions.cqn4
        //let ansques5 = surveyquestions.sqn5
        bot.say("Hello everyone. Please respond to survey #" + ancscode + ". I will send it to your private message shortly.")
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
              let ancename = (member.personDisplayName) ? member.personDisplayName : member.personEmail;
              let ancemail = (member.personEmail) ? member.personEmail : member.personDisplayName;
              //bot.say(`Hello ${ansename}, this is your email ${ansemail}.`)
              console.log(ancename, ancemail, ancscode, anctitle, ancdescr, ancques1, ancques2, ancques3, ancques4)
              sendcovidsurvey(bot, ancename, ancemail, ancscode, anctitle, ancdescr, ancques1, ancques2, ancques3, ancques4)
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


function sendcovidsurvey(bot, ancename, ancemail, ancscode, anctitle, ancdescr, ancques1, ancques2, ancques3, ancques4) {
  //let answersurCARD = {card}
  bot.dmCard(
    ancemail,
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
                  "text": anctitle,
                  "weight": "bolder",
                  "size": "medium"
                },
                {
                  "type": "TextBlock",
                  "text": "Hello " + ancename,
                  "isSubtle": true,
                  "wrap": true
                },
                {
                  "type": "TextBlock",
                  "text": ancdescr + " (Survey Code: " + ancscode + ")",
                  "isSubtle": true,
                  "wrap": true
                },

                {
                  "type": "Input.Text",
                  "id": "cname", // put input in here without quotes (storing name as data in db rn)
                  "value": ancename,
                  "isVisible": false
                },
                {
                  "type": "Input.Number",
                  "id": "csurcode", // put input in here without quotes (storing name as data in db rn)
                  "value": ancscode,
                  "isVisible": false
                },
                {
                  "type": "Input.Text",
                  "id": "cemail", // put input in here without quotes (storing name as data in db rn)
                  "value": ancemail,
                  "isVisible": false
                },
                {
                  "type": "TextBlock",
                  "text": ancques1,
                  "wrap": true
                },
                {
                  "type": "Input.Text",
                  "id": "cq1", // put input in here without quotes (storing name as data in db rn)
                  "placeholder": "Enter your answer here"
                },
                {
                  "type": "TextBlock",
                  "text": ancques2,
                  "wrap": true
                },
                {
                  "type": "Input.Text",
                  "id": "cq2", // put input in here without quotes (storing name as data in db rn)
                  "placeholder": "Enter your answer here"
                },
                {
                  "type": "TextBlock",
                  "text": ancques3,
                  "wrap": true
                },
                {
                  "type": "Input.Text",
                  "id": "cq3", // put input in here without quotes (storing name as data in db rn)
                  "placeholder": "Enter your answer here"
                }, {
                  "type": "TextBlock",
                  "text": ancques4,
                  "wrap": true
                },
                {
                  "type": "Input.Text",
                  "id": "cq4", // put input in here without quotes (storing name as data in db rn)
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
          "id": "covidqncardID"
        }
      ]
    }
  )
}

framework.hears(/covid survey responses/i, function (bot, trigger) {
  console.log("this is inside surveyresponse.");
  responded = true;

  let botName = bot.person.displayName;
  surveycovidmsg = `Enter the survey code of the responses that you want to retrieve.  \nDon't forget to *@${botName}* at the start of your response.`;
  bot.say('markdown', surveycovidmsg)
  
    .then(() => getcovidsurvey(bot));
  //bot.reply(trigger.message);
});


function getcovidsurvey() {
  responded = true;
  console.log("this is inside getsurvey func.");
  framework.hears(/[1-9][0-9]/i, function (bot, trigger) {
    console.log("inside getcovidsurvey");
    responded = true;
    var usercovidsurvey = trigger.text
    var usercovidsurveyStr = JSON.stringify(usercovidsurvey)
    var usercovidsurveyObj = JSON.parse(usercovidsurveyStr)
    let newusercovidsurveystr = usercovidsurveyObj.substring(7)
    //console.log("user search for: " + trigger.text + " ||" + newusersearchstr )
    responded = true;

    //read damn message input and write param inside where
    Survey.findAll({
      where: {
        csurcode: newusercovidsurveystr
      }, raw: true
    }).then((covid) => {

      console.log("in survey then")
      covid.forEach(covidsurveyobj => {
        console.log("inresponse forloop")
        if (covidsurveyobj.csurcode != null) {
          console.log("inresponse notnull")
          console.log("survey: " + survey)
          console.log("covidsurveyobj: " + covidsurveyobj + " , " + covidsurveyobj.csurcode)

          //i++ //increment message is a dog
          //let fbresponsemsg = `**RESPONSE:**`;
          let usercovidsurveystr = "Respondent: " + covidsurveyobj.cname + " (" + covidsurveyobj.cemail + ")" +
            " \nAnswers for..." +
            " \nQ1. " + covidsurveyobj.cq1 +
            " \nQ2. " + covidsurveyobj.cq2 +
            " \nQ3. " + covidsurveyobj.cq3 +
            " \nQ4. " + covidsurveyobj.cq4 +
            " \nQ5. " + covidsurveyobj.cq5
          bot.say("RESPONSE: " + usercovidsurveystr);
        } else {
          console.log("inresponse else")
          bot.say("No responses for survey #" + newusercovidsearchstr + " yet.");
        }
      })
    }).catch(err => console.log(err));
  });

}

//FEATURE: MANAGEMENT - COVID END ////////////////////////////////
//FEATURE: MANAGEMENT - REPORT START ////////////////////////////////

framework.hears('5', function (bot, trigger) {
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
///FEATURE : LOGOUT/////
framework.hears('m9', function (bot, trigger) {
  console.log("called for log out");
  responded = true;
  let managerName = bot.person.displayName; 
  //bot.say(  `Are you sure you want to log out? \n Don't forget to *@${managerName}* at the start of your response.`);
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
  
})
    
// function newlogoutpassword() {
//   responded = true;
//   console.log("in newlogoutpassword here func")
//   framework.hears(/Edward Yes/, function (bot, trigger) {
//   responded = true;
//   bot.say("markdown", 'I can help you... ', '\n\n ' +
//     '1. **get tasks**   (Get your daily tasks for the day) \n' +
//     '2. **feedback**   (Leave a feedback to your manager) \n' +
//     '3. **search**   (Search for product details) \n' +
//     '4. **low stock**   (Check what products are low in stock) \n' +
//     '5. **report**   (Report an incident) \n' +
//     '6. **weather**   (Check for the weather) \n' +
//     '7. **vaccination status**   (Input your vaccination status) \n' +
//     '8. **albert help**   (What you see now)  \n' +
//     '9. **Login** (Log in as a manager)'
//   );
      
//       }
//   )}

//FEATURE : LOGIN///////////////////////////////////

framework.hears(/7/, function (bot, trigger) {
  console.log("someone called for login");
  responded = true;
  let email = trigger.person.emails[0];
  bot.say(`Sending ${trigger.person.displayName} a card privately.`)
    .then(() =>dmPassword(bot, email))
    .catch((e) => console.error(`Problem in help hander: ${e.message}`));
    Password.findAll({
      where: {},
      raw:true,
    }).then((password) => {
      password.forEach(passwordobj=>{
        if (passwordobj.password == "Weiwei123") {
          console.log("yay")
          bot.say("login Successful")
          bot.say("markdown", 'As a manager, you can... ', '\n\n ' +
          '1. **set tasks**   (Set daily tasks for the day for your staff) \n' +
          '2. **add product**   (Add a new product) \n' +
          '3. **create vaccination survey**   (Create a survey) \n' +
          '4. **send vaccination survey**   (Notify your staff and send a survey to them) \n' +
          '5. **vaccination survey responses**   (See the survey responses) \n' +
          '6. **get feedbacks**   (Get feedbacks submitted by your staff) \n' +
          '7. **get reports**   (See incident reports submitted by your staff) \n' +
          '8. **get status**   (See vaccination status submitted by your staff) \n' +
          '9. **log out** (Log out of manager account)'
          //'9. **albert help**   (What you see now)'
        )
    
        }
      })
  
  })
//   Password.findAll({
//     where: {},
//     raw:true,
//   }).then((password) => {
//     password.forEach(passwordobj=>{
//       if (passwordobj.password == "Weiwei123") {
//         console.log("yay")
//         bot.say("login Successful")
//         bot.say("markdown", 'As a manager, you can... ', '\n\n ' +
//         '1. **set tasks**   (Set daily tasks for the day for your staff) \n' +
//         '2. **add product**   (Add a new product) \n' +
//         '3. **create vaccination survey**   (Create a survey) \n' +
//         '4. **send vaccination survey**   (Notify your staff and send a survey to them) \n' +
//         '5. **vaccination survey responses**   (See the survey responses) \n' +
//         '6. **get feedbacks**   (Get feedbacks submitted by your staff) \n' +
//         '7. **get reports**   (See incident reports submitted by your staff) \n' +
//         '8. **get status**   (See vaccination status submitted by your staff) \n' +
//         '9. **log out** (Log out of manager account)'
//         //'9. **albert help**   (What you see now)'
//       )
  
//       }
//     })

// })
})


function dmPassword(bot, email){
  bot.dmCard(
    email,
    {
      "type": "AdaptiveCard",
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "version": "1.2",
      "body": [
        {
          "type": "TextBlock",
          "text": "Login",
          "wrap": true,
          "weight": "bolder",
          "size": "medium"
      },
          {
              "type": "TextBox",
              "text": "Please Enter the Tasks For Today:",
              "wrap": true
          },
          {
              "type": "Input.Text",
              "id": "password",
              "placeholder": "Please Enter Password for Login"
             
          }
      ],
      "actions": [
          {
              "type": "Action.Submit",
              "title": "Login",
              "wrap": "true"
          },
      ]
    },
        "This is the fallback text if the client can't render this card");
    }

  
      
    ;
  



    
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
  CovidQuestions.create(responseInput).then((covidqn) => {
    console.log("covid questions in db");
  })
  Password.create(responseInput).then((password) => {
    console.log("password in db")
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
    //'8. **albert help**   (What you see now)  \n' +
    '8. **Login** (Log in as a manager)'
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

//////function mangerhelp//////
function managerhelp(bot, trigger) {
  console.log("INSIDE MANAGER MENU FUNCTION");
  bot.say("markdown", 'As a manager, you can... ', '\n\n ' +
    '1. **set tasks**   (Set daily tasks for the day for your staff) \n' +
    '2. **add product**   (Add a new product) \n' +
    '3. **create vaccination survey**   (Create a survey) \n' +
    '4. **send vaccination survey**   (Notify your staff and send a survey to them) \n' +
    '5. **vaccination survey responses**   (See the survey responses) \n' +
    '6. **get feedbacks**   (Get feedbacks submitted by your staff) \n' +
    '7. **get reports**   (See incident reports submitted by your staff) \n' +
    //'8. **get status**   (See vaccination status submitted by your staff) \n' +
    '8. **log out** (Log out of manager account)'
    //'9. **albert help**   (What you see now)'
  );
  // var mgremail = trigger.person.emails[0]
  //bot.dm(trigger.person.id, managercmd(bot))
}

// FEATURE: MAINMENU / HELPBOT END ////////////////////////////////
/////Function worker help///
function workerhelp(bot, trigger) {
  console.log("INSIDE MAIN MENU FUNCTION");
  bot.say("markdown", 'I can help you... ', '\n\n ' +
    '1. **get tasks**   (Get your daily tasks for the day) \n' +
    '2. **feedback**   (Leave a feedback to your manager) \n' +
    '3. **search**   (Search for product details) \n' +
    '4. **low stock**   (Check what products are low in stock) \n' +
    '5. **report**   (Report an incident) \n' +
    '6. **weather**   (Check for the weather) \n' +
    //'7. **vaccination status**   (Input your vaccination status) \n' +
    //'8. **albert help**   (What you see now)  \n' +
    '7. **Login** (Log in as a manager)'
  );
}
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
const { password } = require('./config/db');

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



