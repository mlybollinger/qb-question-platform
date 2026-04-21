## conventions

project should use node.js in typescript with postgres and a prisma orm
should generally imitate the schema found in qbplatform/quote
should use express with folders for services, controllers, and routes

## schema

should have the following tables:

question: id, author (foreign key), category (foreign key), question_type (tossup or bonus), tournament (foreign key), created_date, updated_date, status (written or edited or proofread)

tossup: id, question_id (foreign key), question_text, answer
bonus: id, question_id (foreign key), part_1_text, part_1_answer, part_2_text, part_2_answer, part_3_text, part_3_answer

tournament: id, name, metadata (jsonb), due_date, number_of_packets, 

questions_per_packet, distribution (jsonb)

category: id, name
category_relation (closure table): id, child_category_id (foreign), parent_category_id (foreign)
packet_distribution_constraints: id, tournament_id (foreign key), question_type (tossup or bonus), # of questions (number)

packet: id, packet_number, tournament_id (foreign)
packet_question: id, question_id (foreign), question_number, question_type

user: id, first_name, last_name, username, email?, password_hash

tournament_role: id, tournament_id (foreign), user_id (foreign), role_name (writer or editor),  



## endpoints

controllers (non-exhaustive):

user (CRUD)
tournament
question 
packet (get packets with questions, including "packetize" endpoint)




