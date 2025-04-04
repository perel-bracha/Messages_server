CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    message_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    destination_date DATE NOT NULL,
    major_id INT NOT NULL,
    study_year_id INT NOT NULL,
    message_text VARCHAR(1000),
    image_path VARCHAR(255) NULL,
    background_id INT ,
    FOREIGN KEY (major_id) REFERENCES majors(major_id),
    FOREIGN KEY (study_year_id) REFERENCES study_years(study_year_id)
);