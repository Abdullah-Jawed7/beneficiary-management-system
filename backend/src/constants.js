const defaultAvatar ={
 url :'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYI05R8njC7PiGxxK_l04fxSBAVOV68Op0S-HaNH48kFJ480Y-V7ouPY7jC6RINKdxVNE&usqp=CAU'
}  

const userRoles = ['admin', 'receptionist', 'department']

const departments = ["shelter assistance",'food distribution','education support','financial aid','medical aid']

const status = ['pending', 'in_progress', 'completed', 'cancelled']

const DB_NAME = 'bms'
export {
    defaultAvatar,
    userRoles,
    DB_NAME,
    departments,
    status,
}