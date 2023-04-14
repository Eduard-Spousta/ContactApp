//FILL DATABASE WITH DEFAULT/TEST DATA
const mongoose = require('mongoose');
const User = require("../model/User");
const Contact = require("../model/Contact");
const bcrypt = require('bcrypt');

//data
const users = [
  {
    username: "admin",
    email: "admin@admin.com",
    password: "admin"
  },
  {
    username: "James",
    email: "James@me.com",
    password: "James"
  }
];

const contacts = [
  {
    owner: "admin",
    name: "Tech",
    surname: "Support",
    email: "tech@support.com",
    tel: "647654321",
    address: "123 Main St"
  },
  {
    owner: "James",
    name: "Mia",
    surname: "Johnson",
    email: "mia.johnson@example.com",
    tel: 703456789,
    address: "456 Elm St"
  },
  {
    owner: "James",
    name: "Noah",
    surname: "Davis",
    email: "noah.davis@example.com",
    tel: 752555012,
    address: "123 Oak St"
  },
  {
    owner: "James",
    name: "Sophia",
    surname: "Brown",
    email: "sophia.brown@example.com",
    tel: 755455678,
    address: "789 Pine St"
  },
  {
    owner: "James",
    name: "Ethan",
    surname: "Smith",
    email: "ethan.smith@example.com",
    tel: 606555010,
    address: "234 Maple Ave"
  },
  {
    owner: "James",
    name: "Isabella",
    surname: "Lee",
    email: "isabella.lee@example.com",
    tel: 715550167,
    address: "567 Oak St"
  }
];

//mongo db connection
mongoose.connect("mongodb://localhost/ContactApp")
  .catch((error) => console.log(error));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB not connected'));

db.once('open', () => {
  console.log('DB connected');
});

//method fro filling DB
const seedDB = async () => {
  try {
    //hash the password for each user
    const salt = await bcrypt.genSalt(10);
    for (let i = 0; i < users.length; i++) {
      const hashedPassword = await bcrypt.hash(users[i].password, salt);
      users[i].password = hashedPassword;
    }

    //add users to db
    for (let i = 0; i < users.length; i++) {
      const user = new User({
        username: users[i].username,
        email: users[i].email,
        password: users[i].password
      });
      await user.save();
      
      //add users contacts
      for (let j = 0; j < contacts.length; j++) {
        if (contacts[j].owner === users[i].username) {
          const contact = new Contact({
            owner: user.username,
            name: contacts[j].name,
            surname: contacts[j].surname,
            email: contacts[j].email,
            tel: contacts[j].tel,
            address: contacts[j].address
          });
          await contact.save();
        }
      }
    }
    console.log("Seed: SUCCESS");
  } catch (err) {
    console.log("Seed: FAIL", err);
  }
};

//reading data
seedDB()
  .then(() => {
    mongoose.connection.close();
    console.log('DB disconected');
  })
  .catch((err) => {
    console.log('DB failed to disconect');
  });
