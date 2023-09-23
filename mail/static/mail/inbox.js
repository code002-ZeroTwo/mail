window.onload = load_mailbox("inbox");

document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", (e) => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";
}

function load_mailbox(mailbox) {
  let div = document.querySelector("#emails-view");
  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((emails) => {
      console.log(emails);
      for (let i = 0; i < emails.length; i++) {
        let varible;

        if (mailbox == "inbox" || mailbox == "archive") {
          varible = "from";
          var arcbutton = document.createElement("button");
          arcbutton.setAttribute("class", "arcbutton");
          if (mailbox == "inbox") {
            arcbutton.textContent = "archive";
          } else if (mailbox == "archive") {
            arcbutton.textContent = "remove";
          }
        } else if (mailbox == "sent") {
          varible = "recipient";
        }

        let diva = document.createElement("div");
        diva.innerHTML = `<div>${varible} : ${emails[i].recipients} <br> subject: ${emails[i].subject} <br> ${emails[i].timestamp}<br></div>`;
        div.appendChild(diva);

        try {
          diva.appendChild(arcbutton);
        } catch (TypeError) {
          console.log("type error occured");
        }

        if (emails[i].read) {
          diva.style.backgroundColor = "white";
        }

        diva.classList.add("views");
        let id = emails[i].id;
        diva.addEventListener("click", () => {
          ViewEmail(id);
        });

        try {
          let arc = document.querySelectorAll(".arcbutton");
          Array.from(arc).forEach((button) => {
            button.addEventListener("click", (e) => {
              e.stopPropagation();
              archive(id);
              document.location.reload();
            });
          });
        } catch {
          console.log("error");
        }
      }
    });

  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;
}

const changebuttontext = function () {
  let buttons = document.querySelectorAll(".arcbutton");
  buttons.forEach((button) => {
    if (button.innerText == "remove") {
      button.innerText = "removed";
    } else if (button.innerText == "archive") {
      button.innerText = "archived";
    }
  });
};

function ViewEmail(id) {
  let div = document.querySelector("#emails-view");
  let detail = document.createElement("div");
  let reply = document.createElement("button");
  var to_whom;
  var subject;
  var timestamp;
  var by;
  reply.setAttribute("id", "reply");

  fetch(`/emails/${id}`)
    .then((response) => response.json())
    .then((email) => {
      console.log(email.read);
      div.innerHTML = "<h2>Email-View</h2><br>";
      detail.innerHTML = `<b>From</b>: ${email.sender} <br> <b>To</b>: ${email.recipients}`;
      to_whom = email.sender;
      subject = email.subject;
      timestamp = email.timestamp;
      by = email.recipients[0];
      div.appendChild(detail);
      reply.innerText = "reply";
      div.appendChild(reply);
    });

  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true,
    }),
  })
    //.then(response => response.json())
    .then((result) => {
      console.log(result);
    });

  try {
    reply.addEventListener("click", () => {
      document.querySelector("#emails-view").style.display = "none";
      document.querySelector("#compose-view").style.display = "block";
      document.querySelector("#compose-recipients").value = to_whom;
      document.querySelector("#compose-subject").value = subject;
      document.querySelector(
        "#compose-body"
      ).value = `on ${timestamp} ${by} wrote:`;
    });
  } catch {
    console.log("reply button yet not created");
  }

  document.querySelector("#compose-view").style.display = "none";
}

function archive(id) {
  let archive_value;
  fetch(`emails/${id}`)
    .then((response) => response.json())
    .then((email) => {
      archive_value = email.archived;
      if (archive_value == true) {
        archive_value = false;
      } else {
        archive_value = true;
      }
      fetch(`/emails/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          archived: archive_value,
        }),
      });
    });

  load_mailbox("inbox");
}

function new_email() {
  let recipient = document.querySelector("#compose-recipients").value;
  let subject = document.querySelector("#compose-subject").value;
  let body = document.querySelector("#compose-body").value;

  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: recipient,
      subject: subject,
      body: body,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });
}

let btn = document.querySelector("#button");
btn.addEventListener("click", new_email);
