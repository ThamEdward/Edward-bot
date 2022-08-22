framework.hears('login', function (bot, trigger) {
    console.log("called for login");
    responded = true;
    let managerName = bot.person.displayName; 
  
  })

  function newloginpassword() {

    responded = true;
    console.log("in newloginpassword here func")
    framework.hears(/300/, function (bot, trigger) {
    console.log("in newloginpassword here")
    responded = true;
    bot.say(`Hello ${trigger.person.displayName}.`)
      .then(() => managerhelp(bot));
        
        }
    )}
  