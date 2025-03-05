CREATE TABLE blogs (
   id SERIAL PRIMARY KEY,
   author varchar(50),
   url varchar(250) not null,
   title varchar(100) not null,
   likes int default 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Dr King', 'www.hotmail.com', 'The excel of email.', 3);
INSERT INTO blogs (author, url, title, likes) VALUES ('Mancini', 'www.manciniblog.com', 'The new era of emotional health.', 7);