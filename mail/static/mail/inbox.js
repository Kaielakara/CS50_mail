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

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    for (let index = 0; index < emails.length; index++) {
      let email = emails[index];
      let email_div = document.createElement("div");
      document.querySelector('#emails-view').append(email_div);
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
      console.log(emails);
    }
    
  })
}

function submit_mail() {

  fetch("emails/", {
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