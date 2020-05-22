const users = []

//addUser,Remove user,getUser,GetUsersinRoom

const addUser = ({ id, username, room }) => {
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data

    if (!username || !room) {
        return {
            error: 'Username and Room are required'
        }
    }

    //check for exsisting user

    const exsistingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate username

    if (exsistingUser) {

        return {
            error: 'Usernsme is in use'
        }
     }

  
    // store user

    const user = { id, username, room }
    users.push(user)
    return {
        user
    }
}

//remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id)=>{
    return users.find((user)=>user.id===id)
}

const getUsersInRoom = (room)=>{
return users.filter((user)=>user.room === room)

}
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// addUser({
//     id: 22,
//     username: 'joban',
//     room: 'Jalandhar'
// })
// console.log("here are users", users)
// addUser({
//     id: 23,
//     username: 'joban',
//     room: 'Kapurthala'
// })
// addUser({
//     id: 24,
//     username: 'joban',
//     room: 'Kaputhala'
// })
// addUser({
//     id: 25,
//     username: 'joban',
//     room: 'Jalandhar'
// })

// const user = getUser(241)
// console.log("user from find one by id",user)

// const userList = getUsersInRoom('jalandhara')
// console.log("user from ROOM one by id",userList)

// const removedUser = removeUser(22)
// console.log(removedUser)
// console.log(users)