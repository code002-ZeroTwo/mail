# Gmail-like Web Application with Django and JavaScript
This is a Gmail-like web application built using Django and JavaScript. It provides the following features:

- **Send Mail**: You can compose and send emails, making a POST request to /emails with recipients, subject, and body.

- **Mailbox**: You can view your Inbox, Sent mailbox, and Archive, loading the appropriate mailbox using a GET request to /emails/<mailbox>. Each email is displayed with the sender, subject, and timestamp. Unread emails have a white background, while read emails have a gray background.

- **View Email**: Clicking on an email takes you to a view where you can see the email's sender, recipients, subject, timestamp, and body. The email is marked as read automatically.

- **Archive and Unarchive**: You can archive and unarchive received emails. When viewing an Inbox email, there's an option to archive it, and when viewing an Archive email, you can unarchive it.

- **Reply**: You can reply to emails. 
