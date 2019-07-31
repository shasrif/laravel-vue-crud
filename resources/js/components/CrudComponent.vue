<template>
    <div class="content-wrap">
        <section class="content-header">
          <h1>CRUD</h1>
        </section>

        <!-- Main content -->
        <section class="content">
          <!-- Default box -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">User List</h3>

              <div class="card-tools">
                <a href="" class="btn btn-primary" @click.prevent="newModalOpen">Add New User <i class="fa fa-user-plus"></i></a>
              </div>
            </div>
            <div class="card-body">
              <table id="example2" class="table table-bordered table-hover">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in users.data" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name | capText }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.created_at | viewDate }}</td>
                  <td>
                    <a href="#" class="btn-sm btn-primary" @click="updateModalOpen(user)"><i class="fa fa-edit"></i></a>
                    <a href="#" class="btn-sm btn-danger" @click="deleteUser(user.id)"><i class="fa fa-trash"></i></a>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer">
              <pagination :data="users" @pagination-change-page="getResults"></pagination>
            </div>
            <!-- /.card-body -->
          </div>
          <!-- /.card -->
        </section>

        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" v-show="!editMode">Add New User</h5>
                <h5 class="modal-title" v-show="editMode">Update User</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <form @submit.prevent="editMode ? updateUser() : createUser()">
                <div class="modal-body">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="fa fa-user"></i></span>
                    </div>
                    <input v-model="form.name" type="text" name="name" class="form-control" :class="{ 'is-invalid': form.errors.has('name') }" placeholder="Name">
                    <has-error :form="form" field="name"></has-error>
                  </div>

                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="fa fa-envelope"></i></span>
                    </div>
                    <input v-model="form.email" type="email" name="email" class="form-control" :class="{ 'is-invalid': form.errors.has('email') }" placeholder="Email">
                    <has-error :form="form" field="email"></has-error>
                  </div>


                  <div class="input-group mb-3" v-show="!editMode">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="fa fa-lock"></i></span>
                    </div>
                    <input v-model="form.password" type="password" name="password" class="form-control" :class="{ 'is-invalid': form.errors.has('password') }" placeholder="Password">
                    <has-error :form="form" field="password"></has-error>
                  </div>

                  <div class="input-group mb-3" v-show="!editMode">
                    <div class="input-group-prepend">
                      <span class="input-group-text"><i class="fa fa-lock"></i></span>
                    </div>
                    <input v-model="form.password_confirmation" type="password" name="password_confirmation" class="form-control" :class="{ 'is-invalid': form.errors.has('password_confirmation') }" placeholder="Confirm Password">
                    <has-error :form="form" field="password_confirmation"></has-error>
                  </div>
                </div>
              
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button  v-show="!editMode" type="submit" class="btn btn-primary">Create</button>
                  <button  v-show="editMode" type="submit" class="btn btn-primary">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
    export default {
      data() {
        return {
          editMode: false,
          users : {},
          form: new Form({
            id: '',
            name: '',
            email: '',
            password: ''
          })
        }
      },
      methods: {
        newModalOpen() {
          this.form.reset();
          $('#addNew').modal('show');
        },

        updateModalOpen(user) {
          this.editMode = true,
          this.form.reset();
          $('#addNew').modal('show');
          this.form.fill(user);
        },

        createUser() {
          this.$Progress.start();
          this.form.post('user')
          .then(() => {
            $('#addNew').modal('hide');

            toast.fire({
              type: 'success',
              title: 'Created successfully'
            });
            Fire.$emit('afterCreated');

            this.$Progress.finish();
          })
          .catch(() => {
            this.$Progress.fail();
          });
        },

        loadUsers() {
          axios.get("user").then( ({ data }) => ( this.users = data ));
        },

        getResults(page = 1) {
          axios.get('user?page=' + page)
            .then(response => {
              this.users = response.data;
            });
        },

        updateUser() {
          this.$Progress.start();
          this.form.put('user/' + this.form.id)
          .then(() => {
            $('#addNew').modal('hide');

            toast.fire({
              type: 'success',
              title: 'Updated successfully'
            });
            Fire.$emit('afterCreated');

            this.$Progress.finish();
          })
          .catch(() => {
            this.$Progress.fail();
          })
        },

        deleteUser(id) {
          swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {

            this.form.delete('user/' + id).then(() => {
                swal.fire(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                );
                Fire.$emit('afterCreated');
            }).catch(() => {
              swal.fire(
                  'Failed!',
                  'Something went wrong',
                  'warning'
                )
            });
          })
        }
      },
      created() {
        this.loadUsers();

        Fire.$on('afterCreated', () => {
          this.loadUsers();
        })
        
      }
    }
</script>