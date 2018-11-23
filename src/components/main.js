var sports = [];

function check() {
  var date = new Date();
  var milliseconds = date.getTime();
  for (var i = 0; i < sports.length; i++) {
    if (new Date(sports[i].time).getTime() < milliseconds) {
      sports.splice(i, 1);
    }
  }
}

Vue.prototype.$activeUser = new Vue({
  data: {
    arr: [],
    checkJoin: function() {
      for (var i = 0; i < sports.length; i++) {
        for (var j = 0; j < sports[i].joined.length; j++) {
          if (sports[i].joined[j] == this.$activeUser.arr[0].iD) {
            this.$joined.arr.push(sports[i]);
            break;
          }
        }
      }
    }
  }
});

Vue.prototype.$joined = new Vue({
  data: {
    arr: [],
    created: function() {
      var date = new Date();
      var milliseconds = date.getTime();
      for (var i = 0; i < this.$joined.arr.length; i++) {
        if (new Date(this.$joined.arr[i].time).getTime() < milliseconds) {
          this.$joined.arr.splice(i, 1);
        }
      }
    }
  }
});

Vue.prototype.$loggedIn = new Vue({
  data: {
    state: false
  }
});

Vue.component("joined", {
  // props: ["activity", "place", "time", "no"],
  template: `
                          <div>
                            <div style="padding-bottom: 5px" v-for="(post, index) in $joined.arr" :key="index">
                                <el-card class="box-card">
                                    <el-row>
                                        <el-col :span="15">
                                            <el-row>
                                                <span class="activity text">{{post.creator}} wants to </span><span style="font-weight: bold;">{{post.activity}}</span>
                                                <span class="joined text">{{post.no}} person joining</span>
                                            </el-row>
                                            
                                            <el-row>
                                                <span class="time text">At </span><span style="font-weight: bold;">{{post.place}}</span>
                                            </el-row>
                                            <el-row>
                                                <span class="time text">On </span><span style="font-weight: bold;">{{new Date(post.time).toString()}}</span>
                                            </el-row>
                                        </el-col>
                                        
                                    </el-row>
                                </el-card>
                            </div>
                            </div>
`
});

Vue.component("container", {
  // props: ["activity", "place", "time", "no"],
  template: `
                          <div>
                            <div style="padding-bottom: 5px" v-for="(post, index) in $posts.arr" :key="index">
                                <el-card class="box-card">
                                    <el-row>
                                        <el-col :span="15">
                                            <el-row>
                                                <span class="activity text">{{post.creator}} wants to </span><span style="font-weight: bold;">{{post.activity}}</span>
                                                <span class="joined text">{{post.no}} person joining</span>
                                            </el-row>
                                            
                                            <el-row>
                                                <span class="time text">At </span><span style="font-weight: bold;">{{post.place}}</span>
                                            </el-row>
                                            <el-row>
                                                <span class="time text">On </span><span style="font-weight: bold;">{{new Date(post.time).toString()}}</span>
                                            </el-row>
                                        </el-col>
                                        <el-col :span="9">
                                            <el-button type="primary" @click.native="join(index)">Join</el-button>
                                        </el-col>
                                    </el-row>
                                </el-card>
                            </div>
                            </div>
`,
  methods: {
    joined(key) {
      return this.$posts.arr[key].joined == "true";
      save();
      check();
      update();
      this.$joined.created();
    },
    join(key) {
      console.log(this.$activeUser.arr[0]);
      var joined = false;
      for (var i = 0; i < this.$posts.arr[key].joined.length; i++) {
        if (this.$posts.arr[key].joined[i] == this.$activeUser.arr[0].iD) {
          joined = true;
        }
      }
      if (!this.$loggedIn.state) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: teal" },
            "Please log in to join activity."
          )
        });
      } else if (joined) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h("i", { style: "color: teal" }, "Already joined!")
        });
      } else {
        switch (this.$posts.arr[key].type) {
          case "sports":
            sports[key].no = parseInt(sports[key].no) + 1;
            sports[key].joined.push(this.$activeUser.arr[0].iD);
            break;
          case "gaming":
            gaming[key].no = parseInt(gaming[key].no) + 1;
            gaming[key].joined.push(this.$activeUser.arr[0].iD);
            break;
          case "study":
            study[key].no = parseInt(study[key].no) + 1;
            study[key].joined.push(this.$activeUser.arr[0].iD);
            break;
          case "eat":
            eat[key].no = parseInt(eat[key].no) + 1;
            eat[key].joined.push(this.$activeUser.arr[0].iD);
            break;
          case "movie":
            movie[key].no = parseInt(movie[key].no) + 1;
            movie[key].joined.push(this.$activeUser.arr[0].iD);
            break;
          case "conversation":
            conversation[key].no = parseInt(conversation[key].no) + 1;
            conversation[key].joined.push(this.$activeUser.arr[0].iD);
            break;
          case "others":
            others[key].no = parseInt(others[key].no) + 1;
            others[key].joined.push(this.$activeUser.arr[0].iD);
            break;
        }
        this.$activeUser.checkJoin();
        check();
        this.$joined.created();
        save();

        update();
      }
    }
  }
});

Vue.component("activitymenu", {
  template: `
  <div class="text">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">Sports</el-menu-item>
      <el-menu-item index="2">Gaming</el-menu-item>
      <el-menu-item index="3">Study</el-menu-item>
      <el-menu-item index="4">Eat</el-menu-item>
      <el-menu-item index="5">Movie</el-menu-item>
      <el-menu-item index="6">Conversation</el-menu-item>
      <el-menu-item index="7">Others</el-menu-item>
    </el-menu>
    
  </div>
`,
  data() {
    return {
      activeIndex: "1"
    };
  },

  methods: {
    handleSelect(key, keyPath) {
      if (key == "1") {
        this.$posts.arr = sports;
      } else if (key == "2") {
        this.$posts.arr = gaming;
      } else if (key == "3") {
        this.$posts.arr = study;
      } else if (key == "4") {
        this.$posts.arr = eat;
      } else if (key == "5") {
        this.$posts.arr = movie;
      } else if (key == "6") {
        this.$posts.arr = conversation;
      } else if (key == "7") {
        this.$posts.arr = others;
      } else {
        this.$posts.arr = null;
      }
      check();
      this.$joined.created();
      save();

      update();
    }
  }
});

Vue.component("top", {
  template: `

    <div class="text">
      <el-row>
        <el-col :span="14" :offset="2">
          <img src="images/logo.png" alt="Match Up Logo" width="220" height="150">
        </el-col>
        <el-col :span="4" v-if="$loggedIn.state" style="padding-top: 30px">
          <span class="text" style="padding-top: 10px; display: inline-block; font-size: 18px">Welcome {{$activeUser.arr[0].name}} !</span>
        </el-col>
        <el-col :span="2" style="padding-top: 30px">
          <el-button type="primary" icon="el-icon-search">Search</el-button>
        </el-col>
        
        <el-col :span="2" v-if="$loggedIn.state" style="padding-top: 30px">
          <el-button @click.native="logOut" >Log Out</el-button>
        </el-col>
        <el-col :span="2" v-if="!$loggedIn.state" style="padding-top: 30px">
          <el-button @click="dialogLoginVisible = true">Login</el-button>

            <el-dialog title="Login" :visible.sync="dialogLoginVisible">
              <el-form :model="form">
              <el-form-item label="Email" :label-width="formLabelWidth">
              <el-input v-model="loginEmail" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Password" :label-width="formLabelWidth">
              <el-input type="password" v-model="loginPassword" auto-complete="off"></el-input>
              </el-form-item>
          </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogLoginVisible = false">Cancel</el-button>
      <el-button type="primary" @click.native="login">Confirm</el-button>
    </span>
      </el-dialog>
        </el-col>
        <el-col :span="2" v-if="!$loggedIn.state" style="padding-top: 30px">
          <el-button @click="dialogFormVisible = true">Sign Up</el-button>

            <el-dialog title="Sign Up" :visible.sync="dialogFormVisible">
              <el-form :model="form">
              <el-form-item label="Name" :label-width="formLabelWidth">
              <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="University" :label-width="formLabelWidth">
              <el-input v-model="form.university" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Student Matric ID" :label-width="formLabelWidth">
              <el-input v-model="form.iD" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Email" :label-width="formLabelWidth">
              <el-input v-model="form.email" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Password" :label-width="formLabelWidth">
              <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="Select Interest" :label-width="formLabelWidth">
            <el-select
                  v-model="form.interest"
                  multiple
                  collapse-tags
                  placeholder="Interest">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">Cancel</el-button>
      <el-button type="primary" @click.native="signUp">Confirm</el-button>
    </span>
      </el-dialog>
        </el-col>
      </el-row>
    </div>
  `,

  data() {
    return {
      options: [
        {
          value: "sports",
          label: "Sports"
        },
        {
          value: "gaming",
          label: "Gaming"
        },
        {
          value: "study",
          label: "Study"
        },
        {
          value: "eat",
          label: "Eat"
        },
        {
          value: "movie",
          label: "Movie"
        },
        {
          value: "conversation",
          label: "Conversation"
        },
        {
          value: "others",
          label: "Others"
        }
      ],
      dialogFormVisible: false,
      dialogLoginVisible: false,
      form: {
        name: "",
        university: "",
        iD: "",
        email: "",
        password: "",
        interest: ""
      },
      formLabelWidth: "150px",
      loginEmail: "",
      loginPassword: ""
    };
  },

  methods: {
    signUp() {
      if (
        this.form.name == "" ||
        this.form.university == "" ||
        this.form.iD == "" ||
        this.form.email == "" ||
        this.form.password == "" ||
        this.form.interest == ""
      ) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h("i", { style: "color: teal" }, "Please check your input.")
        });
      } else {
        var exist = false;
        for (var i = 0; i < users.length; i++) {
          if (
            users[i].email == this.form.email ||
            users[i].iD == this.form.iD
          ) {
            exist = true;
          }
        }
        if (exist) {
          const h = this.$createElement;

          this.$notify({
            title: "Error",
            message: h(
              "i",
              { style: "color: teal" },
              "Email or Student Matric ID already exist! Please log in."
            )
          });
        } else {
          users.push({
            name: this.form.name,
            university: this.form.university,
            iD: this.form.iD,
            email: this.form.email,
            password: this.form.password,
            interest: this.form.interest
          });

          const h = this.$createElement;

          this.$notify({
            title: "Success",
            message: h(
              "i",
              { style: "color: teal" },
              "Successfully signed up! You may log in now!"
            )
          });
          this.dialogFormVisible = false;
          console.log(this.$loggedIn.state);
          check();
          this.$joined.created();
          save();

          update();
        }
      }
    },
    login() {
      if (this.loginEmail == "" || this.loginPassword == "") {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: teal" },
            "Please fill in Email and Password."
          )
        });
      } else {
        var j = -1;
        for (var i = 0; i < users.length; i++) {
          if (users[i].email == this.loginEmail) {
            j = i;
          }
        }
        if (j == -1 || users[j].password != this.loginPassword) {
          const h = this.$createElement;

          this.$notify({
            title: "Error",
            message: h(
              "i",
              { style: "color: teal" },
              "Wrong Email or Password!"
            )
          });
        } else {
          this.$activeUser.arr.push({
            name: users[j].name,
            university: users[j].university,
            iD: users[j].iD,
            email: users[j].email,
            password: users[j].password,
            interest: users[j].interest
          });
          // this.$activeUser.name = users[j].name;
          // this.$activeUser.university = users[j].university;
          // this.$activeUser.iD = users[j].iD;
          // this.$activeUser.email = users[j].email;
          // this.$activeUser.password = users[j].password;
          // this.$activeUser.interest = users[j].interest;
          this.$loggedIn.state = true;
          const h = this.$createElement;

          this.$notify({
            title: "Success",
            message: h("i", { style: "color: teal" }, "Successfully logged in!")
          });
          this.dialogLoginVisible = false;
          console.log(this.$loggedIn.state);
        }
      }
    },
    logOut() {
      this.$activeUser.arr.pop();
      this.$loggedIn.state = false;
      const h = this.$createElement;

      this.$notify({
        title: "Success",
        message: h("i", { style: "color: teal" }, "Successfully logged out!")
      });
      console.log(this.$loggedIn.state);
    }
  }
});

var app = new Vue({
  el: "#app",
  data() {
    return {
      inputActivity: "",
      inputLocation: "",
      inputName: "",
      inputFaculty: "",
      inputID: "",
      inputtime: "",
      options: [
        {
          value: "sports",
          label: "Sports"
        },
        {
          value: "gaming",
          label: "Gaming"
        },
        {
          value: "study",
          label: "Study"
        },
        {
          value: "eat",
          label: "Eat"
        },
        {
          value: "movie",
          label: "Movie"
        },
        {
          value: "conversation",
          label: "Conversation"
        },
        {
          value: "others",
          label: "Others"
        }
      ],
      value: "",
      interest: ""
    };
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `The limit is 3, you selected ${
          files.length
        } files this time, add up to ${files.length + fileList.length} totally`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    confirm() {
      console.log(this.$loggedIn.state);
      if (!this.$loggedIn.state) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: teal" },
            "Please log in to add activity."
          )
        });
      } else if (
        this.inputActivity == "" ||
        this.inputtime == "" ||
        this.inputLocation == "" ||
        this.value == ""
      ) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h("i", { style: "color: teal" }, "Please check your inputs.")
        });
      } else if (new Date(this.inputtime).getTime() < new Date().getTime()) {
        const h = this.$createElement;

        this.$notify({
          title: "Error",
          message: h(
            "i",
            { style: "color: teal" },
            "Please check your date and time."
          )
        });
      } else {
        switch (this.value) {
          case "sports":
            sports.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1",
              creator: this.$activeUser.arr[0].name,
              joined: [this.$activeUser.arr[0].iD],
              type: this.value
            });
            console.log("Success");
            break;
          case "gaming":
            gaming.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1",
              creator: this.$activeUser.arr[0].name,
              joined: [this.$activeUser.arr[0].iD],
              type: this.value
            });
            console.log("Success");
            break;
          case "study":
            study.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1",
              creator: this.$activeUser.arr[0].name,
              joined: [this.$activeUser.arr[0].iD],
              type: this.value
            });
            console.log("Success");
            break;
          case "eat":
            eat.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1",
              creator: this.$activeUser.arr[0].name,
              joined: [this.$activeUser.arr[0].iD],
              type: this.value
            });
            console.log("Success");
            break;
          case "movie":
            movie.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1",
              creator: this.$activeUser.arr[0].name,
              joined: [this.$activeUser.arr[0].iD],
              type: this.value
            });
            console.log("Success");
            break;
          case "conversation":
            conversation.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1",
              creator: this.$activeUser.arr[0].name,
              joined: [this.$activeUser.arr[0].iD],
              type: this.value
            });
            console.log("Success");
            break;
          case "others":
            others.push({
              activity: this.inputActivity,
              place: this.inputLocation,
              time: new Date(this.inputtime),
              no: "1",
              creator: this.$activeUser.arr[0].name,
              joined: [this.$activeUser.arr[0].iD],
              type: this.value
            });
            console.log("Success");
            break;
          default:
            console.log("unknown category");
        }
        const h = this.$createElement;

        this.$notify({
          title: "Success",
          message: h(
            "i",
            { style: "color: teal" },
            "Your activity has been added successfully!"
          )
        });
        this.$joined.arr.push({
          activity: this.inputActivity,
          place: this.inputLocation,
          time: new Date(this.inputtime),
          no: "1",
          creator: this.$activeUser.arr[0].name,
          joined: [this.$activeUser.arr[0].iD],
          type: this.value
        });
        check();
        this.$joined.created();
        save();

        update();
      }
    }
  }
});
