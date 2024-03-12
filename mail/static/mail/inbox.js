document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', submit_mail);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    for (let index = 0; index < emails.length; index++) {
      // create certain variables that would be used to store certain values
      let email = emails[index];
      // the first variable is for the div that willbe seen as the child div of the div whihch is already present in the HTML file
      let email_div = document.createElement("div");
      document.querySelector('#emails-view').append(email_div);
      // you now create new variables which you'll store the new 'p' tags that you'll store there
      let email_user = document.createElement('p');
      email_user.innerHTML = email.sender;
      email_div.append(email_user);
      let email_subject = document.createElement('p');
      email_subject.innerHTML = email.subject;
      email_div.append(email_subject);
      let email_time = document.createElement('p');
      email_time.innerHTML = email.timestamp;
      email_div.append(email_time);
      email_time.className = "email_timestamp"
      if (email.read == true){
        email_div.style.background = "white";
      }
      
      email_div.addEventListener('click', () => load_email(email.id))
    }

    console.log(emails);
    
  })
}

function submit_mail() {

  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector("#compose-subject").value,
      body: document.querySelector("#compose-body").value
    })
  })

  .then(response => response.json())
  .then(result => {
    console.log(result);
  })
}

function load_email(num) {

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  fetch(`/emails/${num}`)
  .then(response => response.json())
  .then(email => {

    

    const email_list = [email.sender, email.recipients, email.subject, email.timestamp];
    const email_list_html = ["#email_from", "#email_to", "#email_subject", "#email_time"];

    for (let index = 0; index < email_list.length; index++) {
      document.querySelector(`${email_list_html[index]}`).innerHTML = ` ${email_list[index]}`;
    }

    email_reply = document.querySelector("#email_reply")
    email_archive = document.querySelector("#email_archive")
    if(email.archived == false){
      email_archive.innerHTML = "Archive";
      email_archive.addEventListener('click', () => archive(num))
    }else{
      email_archive.innerHTML = "UnArchive"
      email_archive.addEventListener('click', () => unarchive(num))
    }

    
    

    document.querySelector("#email_body").innerHTML = email.body
    console.log(email);

  })

  fetch(`/emails/${num}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true
    })
  })
}


function archive(id){

  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      archived:true
    })
  })
  load_mailbox('inbox');  

}

function unarchive(id){

  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      archived: false
    })
  })
  load_mailbox('inbox');
}