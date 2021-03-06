import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'

import { NotificationsService } from 'angular2-notifications'

import { FormReactive, UserService, USER_PASSWORD } from '../../shared'

@Component({
  selector: 'my-account-change-password',
  templateUrl: './account-change-password.component.html'
})

export class AccountChangePasswordComponent extends FormReactive implements OnInit {
  error: string = null

  form: FormGroup
  formErrors = {
    'new-password': '',
    'new-confirmed-password': ''
  }
  validationMessages = {
    'new-password': USER_PASSWORD.MESSAGES,
    'new-confirmed-password': USER_PASSWORD.MESSAGES
  }

  constructor (
    private formBuilder: FormBuilder,
    private router: Router,
    private notificationsService: NotificationsService,
    private userService: UserService
  ) {
    super()
  }

  buildForm () {
    this.form = this.formBuilder.group({
      'new-password': [ '', USER_PASSWORD.VALIDATORS ],
      'new-confirmed-password': [ '', USER_PASSWORD.VALIDATORS ]
    })

    this.form.valueChanges.subscribe(data => this.onValueChanged(data))
  }

  ngOnInit () {
    this.buildForm()
  }

  changePassword () {
    const newPassword = this.form.value['new-password']
    const newConfirmedPassword = this.form.value['new-confirmed-password']

    this.error = null

    if (newPassword !== newConfirmedPassword) {
      this.error = 'The new password and the confirmed password do not correspond.'
      return
    }

    this.userService.changePassword(newPassword).subscribe(
      () => this.notificationsService.success('Success', 'Password updated.'),

      err => this.error = err
    )
  }
}
