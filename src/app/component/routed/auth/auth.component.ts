import {Component, OnInit} from '@angular/core'
import {LoginUser} from "../../../dto/LoginUser"
import {AuthService} from "../../../service/auth.service"
import {Router} from "@angular/router"
import {MeProvider} from "../../../provider/me-provider"
import {Token} from "../../../dto/Token"
import {TokenProvider} from "../../../provider/token-provider"

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {

	loginUser: LoginUser

	constructor(
		private router: Router,
		private authService: AuthService,
		private tokenProvider: TokenProvider,
		private meProvider: MeProvider
	) {
		this.loginUser = {
			login: '',
			password: ''
		}
	}

	ngOnInit(): void {
	}

	login() {
		this.authService
			.authenticate(this.loginUser)
			.subscribe(
				({token}: Token) => {
					console.debug(`successful auth, token: ${token}`)
					this.tokenProvider.setToken(token)
					this.meProvider.setByToken(token)
					this.router.navigate(['/im'])
				},
				error => console.debug(error)
			)
	}
}
