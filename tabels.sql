/* SQL commands to set up DB */

CREATE TABLE user_details(
    user_id NUMERIC(50) PRIMARY KEY,
    first_name VARCHAR (50)NOT NULL,
    last_name VARCHAR (50)NOT NULL,
    birth_date VARCHAR(50) NOT NULL,
    type VARCHAR (50) NOT NULL,
    picture VARCHAR (50), 
    phone VARCHAR (20)NOT NULL,
    email VARCHAR (50), 
    contacts BOOLEAN NOT NULL
    );
	
CREATE TABLE user_credentials(
	user_id NUMERIC(50),
	password VARCHAR(50) NOT NULL,
	last_password_change TIMESTAMP NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user_details(user_id) ON DELETE CASCADE
	);


CREATE TABLE committee(
    committee_name VARCHAR(50) PRIMARY KEY,
    committee_information VARCHAR(200),
    contact_information VARCHAR(50)
    );
    
    
CREATE TABLE committee_decisions(
    committee_name VARCHAR(50)REFERENCES committee(committee_name),
    decision_id VARCHAR(50) PRIMARY KEY,
    committee_decision VARCHAR (50),
    committee_picture VARCHAR(50),
    committee_link VARCHAR(50),time TIMESTAMP
    );


    CREATE TABLE committee_participants(
    user_id NUMERIC (50) REFERENCES user_details(user_id),
    committee_name VARCHAR (50) REFERENCES committee(committee_name),
    PRIMARY KEY(user_id, committee_name),
    committee_position VARCHAR (50)
    );



CREATE TABLE mapping (
    location_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR ( 50 ) NOT NULL,
    type VARCHAR ( 50 ) NOT NULL,
    subType VARCHAR ( 50 ),
    coordinate VARCHAR ( 50 )NOT NULL,
    phone VARCHAR ( 50 )NOT NULL, 
    important VARCHAR ( 50 ),
    email VARCHAR ( 50 )
    );
    
    CREATE TABLE report (
    report_id VARCHAR ( 50 ) PRIMARY KEY,
    headline VARCHAR ( 50 ) NOT NULL,
    content VARCHAR ( 50 ) NOT NULL,
    type VARCHAR ( 50 ) ,
    time_and_date TIMESTAMP ,
    picture VARCHAR ( 50 )  
    );
         
CREATE TABLE private_teachers (
    teacher_id NUMERIC PRIMARY KEY,
    first_name VARCHAR ( 50 ) NOT NULL,
    last_name VARCHAR ( 50 ) NOT NULL,
    study_subjects VARCHAR ( 50 )  ,
    area VARCHAR ( 50 ) ,
    study_classes VARCHAR ( 50 ) ,
    phone VARCHAR ( 50 )
    );



CREATE TABLE good_feedback (
    user_id_given_feedback NUMERIC ( 50 ) REFERENCES user_details(user_id),
    user_id NUMERIC ( 50 ) REFERENCES user_details(user_id),
    subject VARCHAR ( 50 )  NOT NULL,
    content VARCHAR ( 50 ) NOT NULL,
    time TIMESTAMP
    );



CREATE TABLE inbox (
   inbox_id SERIAL PRIMARY KEY NOT NULL,
    receiver NUMERIC ( 50 ) REFERENCES user_details(user_id) NOT NULL,
    sender NUMERIC ( 50 ) REFERENCES user_details(user_id) NOT NULL,
    subject VARCHAR ( 50 )  ,
    content VARCHAR ( 50 ) ,
    time TIMESTAMP
    );


 CREATE TABLE usage_data(
    user_id NUMERIC ( 50 ) REFERENCES user_details(user_id) NOT NULL,
    page_id VARCHAR ( 50 ) NOT NULL,
    page_description VARCHAR ( 50 ) NOT NULL,
    time TIMESTAMP
    );


CREATE TABLE xpertesy(
    link VARCHAR (50) PRIMARY KEY NOT NULL,
    host_id NUMERIC (50) REFERENCES user_details(user_id) NOT NULL,
    participants VARCHAR[] NOT NULL,
    value_date TIMESTAMP,
    title VARCHAR (50)
    );