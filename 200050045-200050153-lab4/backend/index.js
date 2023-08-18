// const express = require("express");
// const app = express();
const cors = require("cors");
const path = require("path");
// const helmet = require("helmet");
const pool = require("./db");
require("dotenv").config();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
// const File_Store = require("session-file-store");

//middleware
const express = require('express');
const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  exposedHeaders: ['Set-Cookie'],

};
app.use(cors(corsOptions));
app.use(express.json()); //req.bodyapp.use(express.json());
app.use(express.urlencoded({ extended: false }));
// const session = require("express-session");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))




const session = require('express-session');
// app.use(
//   session({
//     secret: process.env.COOKIE_SECRET,
//     credentials: true,
//     name: "sid",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
//       httpOnly: true,
//       expires: 60 * 1000 * 24 * 24 * 7,
//       sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
//     },
//   })
// );
// app.use(session({
//   name: "session",
//   secret: "GFGEnter", // Secret key,
//   saveUninitialized: false,
//   resave: false,
//   // store: new filestore()
// }));
app.use(session({
  // store: new File_Store,
  name: "session",
  secret: "mysecret",
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false
}));
app.use(cookieParser());

var session1;

//ROUTES//

// //create a todo

// app.post("/todos", async (req, res) => {
//   try {
//     const { description } = req.body;
//     const newTodo = await pool.query(
//       "INSERT INTO todo (description) VALUES($1) RETURNING *",
//       [description]
//     );

//     res.json(newTodo.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //get all todos

// app.get("/todos", async (req, res) => {
//   try {
//     const allTodos = await pool.query("SELECT * FROM todo");
//     res.json(allTodos.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //get a todo

// app.get("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
//       id
//     ]);

//     res.json(todo.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //update a todo

// app.put("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { description } = req.body;
//     const updateTodo = await pool.query(
//       "UPDATE todo SET description = $1 WHERE todo_id = $2",
//       [description, id]
//     );

//     res.json("Todo was updated!");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //delete a todo

// app.delete("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
//       id
//     ]);
//     res.json("Todo was deleted!");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

async function curr_sem_s(){
  const currentDate = new Date();
  console.log(currentDate);
  let curr_sem = await pool.query('select * from reg_dates where start_time <= $1 order by start_time desc limit 1;',[currentDate]);

  return {year : curr_sem.rows[0].year, semester : curr_sem.rows[0].semester};
}


app.post('/', async (req, res) => {
  try {
    // res.send("User Page");
    const potentialLogin = await pool.query(
      "SELECT ID, hashed_password FROM user_password WHERE user_password.ID=$1",
      [req.body.username]
    );
    if (potentialLogin.rowCount > 0) {
      console.log(req.body.password);
      console.log(potentialLogin.rows[0].hashed_password);
      console.log(req.body.username);

      const isSamePass = await bcrypt.compare(
        req.body.password,
        potentialLogin.rows[0].hashed_password
      );
      // const isSamePass = (req.body.password == potentialLogin.rows[0].hashed_password);
      if (isSamePass) {
        // session1.username=req.body.username;
        // console.log(`req.session in login : ${req.session}`)
        // console.log(`session1 in login : ${session1}`);
        // res.session.user = req.body.username;
        // res.session.save(function (err) {
        //   if (err) return next(err)
        //   // res.redirect('/login')
        // })
        // res.cookie
        // res.cookie("username", req.body.username);
        req.session.user = req.body.username;
        console.log(req.session);
        // session1 = req.session;
        // console.log(`Logged In ${req.session.user}`);
        res.json({ loggedIn: true, username: req.body.username });
        // console.log("hello");
        // res.json({ loggedIn: true, username: req.body.username });
      } else {
        res.json({ loggedIn: false, status: "Wrong username or password!" });
        console.log("not good");
      }
    } else {
      console.log("not good");
      res.json({ loggedIn: false, status: "Wrong username or password!" });
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.send("logged out");
    console.log("logged out");
    console.log(req.session);
  });
});

app.get('/login', async (req, res) => {
  try {
    // const { id } = req.params;

    if (req.session.user) {
      // res.json({ loggedIn: true, username: req.session.user.username });
      // const todo = await pool.query("SELECT ID, name, dept_name, tot_cred, course_id FROM  student natural join takes WHERE id = $1", [req.session.user]);
      // const curr_sem = await pool.query("SELECT year, semester from reg_dates where start_time = $1", [curr_time])
      // const curr_sem = {year:2010, semester:'Spring'};
      // console.log(toso.rows);
      console.log('sending authed');
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});

//Home
app.get('/home', async (req, res) => {
  try {
    // const { id } = req.params;
    console.log("Started home");
    // req.session = session1
    // console.log(req.session);

    if (req.session.user) {
      // res.json({ loggedIn: true, username: req.session.user.username });
      const todo = await pool.query("SELECT ID, name, dept_name, tot_cred, course_id FROM  student natural join takes WHERE id = $1", [req.session.user]);
      // const curr_sem = await pool.query("SELECT year, semester from reg_dates where start_time = $1", [curr_time])
      // const curr_sem = { year: 2010, semester: 'Fall' };
      const curr_sem  = await curr_sem_s();
      // console.log(curr_sem);
      const prev_year_sems = await pool.query("SELECT distinct year,takes.semester,X.num  FROM takes join (VALUES ('Fall',1),('Summer',2),('Spring',3)) as X(semester, num) on takes.semester= X.semester where  (takes.year != $2 or takes.semester != $3) and id = $1 order by year desc, X.num asc;", [
        req.session.user, curr_sem['year'], curr_sem['semester']
      ]);
      const curr_sem_courses = await pool.query("select distinct id, course_id, title, credits, grade from takes natural join course where (takes.year = $2 and takes.semester = $3) and id = $1", [req.session.user, curr_sem['year'], curr_sem['semester']]);
      const curr_courses_data = { year: curr_sem['year'], semester: curr_sem['semester'], tables: curr_sem_courses.rows }
      // console.log("CURRENT SEM COURSES");
      // console.log(curr_courses_data);

      let prev_courses_data = [];
      // console.log("HENIUB JN");
      // console.log(prev_year_sems.rows);

      for (let i = 0; i < prev_year_sems.rows.length; i++) {
        // console.log(prev_year_sems.rows[i].year);
        // console.log(prev_year_sems.rows[i].semester);

        const prev_sem_query = await pool.query("select distinct id, course_id, title, credits, grade from takes natural join course where (takes.year = $2 and takes.semester = $3) and id = $1", [req.session.user, prev_year_sems.rows[i].year, prev_year_sems.rows[i].semester]);

        course_for_sem = { year: prev_year_sems.rows[i].year, semester: prev_year_sems.rows[i].semester, tables: prev_sem_query.rows };
        // console.log(course_for_sem);

        prev_courses_data.push(course_for_sem);

      }

      // console.log(prev_courses_data);
      // let ts = Date.now();
      

      // console.log(toso.rows);
      res.json({ tables: todo.rows, curr_courses: curr_courses_data, prev_courses: prev_courses_data, authenticated: true });
    } else {
      res.json({ loggedIn: false, authenticated: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});

//Register

app.get("/registration", async (req, res) => {
  try {
    // const { id } = req.params;
    if (req.session.user) {
      const curr_sem = await curr_sem_s();
      const todo = await pool.query("SELECT distinct row_number() over (order by course_id) as id, course_id, title, credits  FROM  course natural join section where year = $1 and semester = $2", [curr_sem['year'], curr_sem['semester']]);
      const todo1 = await pool.query("SELECT distinct course_id FROM  course natural join section where year = $1 and semester = $2", [curr_sem['year'], curr_sem['semester']]);
      curr_courses = todo1.rows;

      let sec_data = {};
      // console.log("HENIUB JN");
      // console.log(prev_year_sems.rows);

      for (let i = 0; i < curr_courses.length; i++) {
        const todo2 = await pool.query("SELECT sec_id from section where year = $1 and semester = $2 and course_id = $3", [curr_sem['year'], curr_sem['semester'], curr_courses[i]['course_id']]);
        sec_data[curr_courses[i]['course_id']] = todo2.rows;
      }

      console.log(curr_courses);
      console.log(sec_data);
      console.log("inside registration");
      console.log(todo.rows);
      res.json({ tables: [todo.rows, sec_data], authenticated: true });
    }
    else {
      res.json({ loggedIn: false, authenticated: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/register_check", async (req, res) => {
  try {
    const { course_id, sec_id } = req.body;
    console.log(course_id);
    const curr_sem = await curr_sem_s();

    // prereqs check
    const todo1 = await pool.query("SELECT distinct prereq_id from prereq where course_id = $1", [course_id]);
    const todo4 = await pool.query("SELECT * from takes where ID = $1 and course_id in (SELECT prereq_id from prereq where course_id = $2)", [req.session.user, course_id]);
    const prereqs_done = (todo1.rowCount == todo4.rowCount);

    //slot check
    const todo2 = await pool.query("SELECT time_slot_id from section where course_id = $1 and year = $2 and semester = $3", [course_id, curr_sem['year'], curr_sem['semester']]);
    const course_time_slot = todo2.rows['time_slot_id'];
    const todo3 = await pool.query("SELECT * from takes natural join section where id = $1 and time_slot_id = $2 and year = $3 and semester = $4", [req.session.user, course_time_slot, curr_sem['year'], curr_sem['semester']]);
    const no_slot_clash = (todo3.rowCount == 0);

    console.log("inside register");

    const todo5 = await pool.query("SELECT * from takes where id = $1 and course_id = $2", [req.session.user, course_id]);
    console.log(todo5.rows);
    const is_taken = !(todo5.rowCount == 0);

    // insert into database
    if (no_slot_clash && prereqs_done && !is_taken) {
      const todo6 = await pool.query("INSERT into takes values ($1, $2, $3, $4, $5, $6)", [req.session.user, course_id, sec_id, curr_sem['semester'], curr_sem['year'], null]);
      const todo7 = await pool.query("select credits from course where course_id = $1", [course_id])
      console.log(todo7.rows);
      const credits = todo7.rows[0]['credits'];
      console.log(`credits : ${credits}`);
      const todo8 = await pool.query("UPDATE student SET tot_cred = tot_cred + $2 WHERE id = $1;", [req.session.user, credits]);
      console.log("Successfully registered and inserted");
    }

    // console.log([todo1.rows, todo2.rows, todo3.rows, todo4.rows, todo5.rows]);
    console.log([no_slot_clash, prereqs_done, is_taken]);
    res.json([no_slot_clash, prereqs_done, is_taken]);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/drop", async (req, res) => {
  try {
    const { id, course_id } = req.body;
    console.log(course_id);
    const curr_sem = await curr_sem_s();
    const checkdrop = await pool.query("SELECT count(*) as count from takes where course_id = $1 and id = $2", [course_id, id]);
    if (checkdrop.rows[0]['count'] == '0') {
      console.log("Already Dropped");
    }
    else {
      const todo = await pool.query("DELETE from takes where course_id = $1 and id = $2", [course_id, id]);
      const todo1 = await pool.query("select credits from course where course_id = $1", [course_id])
      console.log(todo1.rows);
      const credits = todo1.rows[0]['credits'];
      console.log(`credits : ${credits}`);
      const todo2 = await pool.query("UPDATE student SET tot_cred = tot_cred - $2 WHERE id = $1;", [req.session.user, credits]);
      console.log("successfully Dropped");
    }

  } catch (err) {
    console.error(err.message);
  }
});



//get a course info pages

app.get("/course/:course_id", async (req, res) => {
  try {
    console.log("Hello");
    if (req.session.user) {
      const { course_id } = req.params;
      const curr_sem = await curr_sem_s();
      console.log(course_id);
      const todo = await pool.query("SELECT course_id, title, credits FROM  course natural join section WHERE course_id = $1", [course_id]);
      const todo1 = await pool.query("SELECT prereq_id from prereq where course_id = $1", [course_id]);
      const todo2 = await pool.query("SELECT distinct ID, name from instructor natural join teaches where course_id = $1", [course_id]);
      // res.json({id: id});
      console.log([todo.rows, todo1.rows, todo2.rows]);
      res.json({ tables: [todo.rows, todo1.rows, todo2.rows], authenticated: true });
    }
    else {
      res.json({ loggedIn: false, authenticated: false });
    }
    // res.json(todo1.rows)
    // console.log(todo1.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/running_departments', async (req, res) => {
  try {
    // const { id } = req.params;
    // const curr_time = await pool.query("SELECT max(start_time) from reg_dates");
    // const curr_sem = await pool.query("SELECT year, semester from reg_dates where start_time = $1", [curr_time])
    if (req.session.user) {
      const curr_sem = await curr_sem_s();
      const todo = await pool.query("SELECT distinct dept_name FROM teaches natural join course where year = $1 and semester = $2 order by dept_name", [curr_sem['year'], curr_sem['semester']]);
      // const todo = await pool.query("SELECT dept_name FROM course ORDER BY dept_name");
      res.json({ tables: todo.rows, authenticated: true });
    }
    else {
      res.json({ loggedIn: false, authenticated: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/running_courses/:dept_name", async (req, res) => {
  try {
    if (req.session.user) {
      const { dept_name } = req.params;
      const curr_sem = await curr_sem_s();
      const todo = await pool.query("SELECT distinct course_id, title, dept_name FROM teaches natural join course where dept_name = $1 and year = $2 and semester = $3 order by dept_name", [dept_name, curr_sem['year'], curr_sem['semester']]);
      console.log(curr_sem);
      console.log(todo.rows);
      res.json({ tables: todo.rows, authenticated: true });
    }
    else {
      res.json({ loggedIn: false, authenticated: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});

// get a instructor pages

app.get('/instructor/:instructor_id', async (req, res) => {
  try {
    if (req.session.user) {
      const { instructor_id } = req.params;
      console.log(req.params);
      const curr_sem = await curr_sem_s();
      console.log('check1');
      const todo = await pool.query("SELECT distinct * FROM teaches natural join instructor, course WHERE ID = $1 and year = $2 and semester = $3 and teaches.course_id = course.course_id order by course.course_id", [
        instructor_id, curr_sem['year'], curr_sem['semester']
      ]);

      console.log('check2');
      const todo1 = await pool.query("SELECT * FROM teaches natural join instructor join (VALUES ('Fall',1),('Summer',2),('Spring',3)) as X(semester, num) on teaches.semester= X.semester, course where teaches.course_id = course.course_id and  (teaches.year != $2 or teaches.semester != $3) and id = $1 order by year desc, X.num asc;", [
        instructor_id, curr_sem['year'], curr_sem['semester']
      ]);

      console.log('check3');
      console.log("check");
      res.json({ tables: [todo.rows, todo1.rows], authenticated: true });
    }
    else {
      res.json({ loggedIn: false, authenticated: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});



app.get('/alldepts', async (req, res) => {
  try {
    // const { id } = req.params;
      // res.json({ loggedIn: true, username: req.session.user.username });
  if (req.session.user) {
      const todo = await pool.query("SELECT dept_name FROM  department");
      // const curr_sem = await pool.query("SELECT year, semester from reg_dates where start_time = $1", [curr_time])
      // const curr_sem = {year:2010, semester:'Spring'};
      // console.log(toso.rows);
      // console.log('sending authed');
      res.json(todo.rows);
    } else {
      res.json({ authenticated: false });
    }

  } catch (err) {
    console.error(err.message);
  }
});

app.get('/allcourses', async (req, res) => {
  try {
    // const { id } = req.params;
if (req.session.user) {
      // res.json({ loggedIn: true, username: req.session.user.username });
      const todo = await pool.query("SELECT course_id, title FROM  course");
      // const curr_sem = await pool.query("SELECT year, semester from reg_dates where start_time = $1", [curr_time])
      // const curr_sem = {year:2010, semester:'Spring'};
      // console.log(toso.rows);
      // console.log('sending authed');
      res.json(todo.rows);
    } else {
      res.json({ authenticated: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/deptcourses/:dept', async (req, res) => {
  try {
    const { dept } = req.params;

    if (req.session.user) {
      // res.json({ loggedIn: true, username: req.session.user.username });
      const todo = await pool.query("SELECT course_id, title FROM  course  where dept_name = $1",[dept]);
      // const curr_sem = await pool.query("SELECT year, semester from reg_dates where start_time = $1", [curr_time])
      // const curr_sem = {year:2010, semester:'Spring'};
      // console.log(toso.rows);
      // console.log('sending authed');
      res.json(todo.rows);
    } else {
      res.json({ authenticated: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/studentinfo/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const q = await pool.query("SELECT * FROM  instructor  where id = $1",[req.session.user]);
    console.log(q.rows);

    if (req.session.user == id || q.rowCount > 0) {
      // res.json({ loggedIn: true, username: req.session.user.username });
      const todo = await pool.query("SELECT * FROM  student natural join takes  where id = $1",[id]);
      // const curr_sem = await pool.query("SELECT year, semester from reg_dates where start_time = $1", [curr_time])
      // const curr_sem = {year:2010, semester:'Spring'};
      // console.log(toso.rows);
      // console.log('sending authed');
      res.json(todo.rows);
    } else {
      res.json({ authenticated: false });
    }
  } catch (err) {
    console.error(err.message);
  }
});







app.listen(5000, () => {
  console.log("server has started on port 5000");
});

// app.get('/list_depts')


