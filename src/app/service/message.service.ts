import {Injectable} from '@angular/core'
import {HttpClient} from "@angular/common/http"
import {Observable} from "rxjs"
import {environment} from "../../environments/environment"
import {generateHttpOptionsWithTokenHeader} from "../../constant"
import {Pageable} from "../util/Pageable"
import {Message} from "../dto/Message"
import {MessageGroup} from "../dto/MessageGroup"

@Injectable({
	providedIn: 'root'
})
export class MessageService {

	MESSAGE_URL = 'message'

	constructor(private http: HttpClient) {
	}

	get(token: string, conversationId: number, pageable: Pageable): Observable<Message[]> {
		return this.http.get<Message[]>(
			`${environment.API_URL}/${this.MESSAGE_URL}/get`,
			{
				params: pageable.toHttpParams()
					.append('conversationId', conversationId.toString()),
				...generateHttpOptionsWithTokenHeader(token)
			}
		)
	}

	delete(token: string, deleteMessages: Message[]): Observable<void> {
		return this.http.post<void>(
			`${environment.API_URL}/${this.MESSAGE_URL}/delete`,
			deleteMessages,
			generateHttpOptionsWithTokenHeader(token)
		)
	}

	formatShortMessageText(message: Message): string {
		return message.text || '[attachment]'
	}

	groupMessagesBySender(messages: Message[]): MessageGroup[] {
		if (messages.length === 0) return []

		const result: Message[][] = []
		let buffer: Message[] = [messages[0]]

		for (let i = 1; i < messages.length; i++) {
			if (messages[i].sender.id === messages[i - 1].sender.id) {
				buffer.push(messages[i])
			} else {
				result.push(buffer)
				buffer = [messages[i]]
			}
		}
		result.push(buffer)

		return result.map(group => new MessageGroup(group[0].sender, group))
	}

}
