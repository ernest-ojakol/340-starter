--- 1
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES(
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--- 2
update account
set account_type = 'Admin'
where account_id = 1;
--- 3
delete from account
where account_id = 1;
--- 4
UPDATE inventory
SET inv_desciption = REPLACE(
        inv_desciption,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
--- 5
SELECT inventory.inv_make,
    inventory.inv_model,
    classification.classification_name
FROM inventory
    INNER JOIN classification ON(
        inventory.classification_id = classification.classification_id
    )
WHERE inventory.classification_id = 2;
--- 6
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');