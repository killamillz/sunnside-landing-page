"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const createUser = (req, res) => {
    //we imported this from config to call all our methods to query the datbase
    try {
        const { firstName, lastName, email } = req.body;
        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(400).json({
                message: `User already exists`
            });
        }
        const salt = await SaltGenerator();
        const password = await passwordGenerator(lastName);
        const hashedPassword = await hashPassword(password, salt);
        if (!findUser) {
            let newUser = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: "Author",
                books: []
            });
            const mainUser = await User.findOne({ email });
            console.log(mainUser);
            if (mainUser) {
                const html = emailHtml(email, password);
                await sendmail(`${process.env.GMAIL_USER}`, email, 'welcome', html);
                return res.status(200).json({
                    message: `User created successfully`,
                    role: mainUser.role
                });
            }
            return res.status(401).json({
                message: `Unable to create user`
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            mesage: 'Internal server error',
            Error: '/users/create'
        });
    }
};
exports.createUser = createUser;
;
