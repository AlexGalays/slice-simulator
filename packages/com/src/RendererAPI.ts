import {
	AllChannelReceiverOptions,
	ChannelReceiver,
	RequestMessage,
	ResponseMessage,
	Transaction,
	TransactionHandler,
	TransactionsHandlers,
} from "./channel";
import { ClientRequestType, ClientTransactions } from "./types";

export const rendererAPIDefaultOptions: Partial<AllChannelReceiverOptions> = {
	requestIDPrefix: "renderer-",
};

export const notImplementedHandler: TransactionHandler<
	// This is the only place we need an "any transaction" type, might need a dedicated type for it if we start to use it elsewhere
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Transaction<RequestMessage<any, any>, ResponseMessage<any, any>>
> = (_res, res) => {
	return res.error(undefined, 501);
};

export class RendererAPI extends ChannelReceiver<ClientTransactions> {
	constructor(
		requestHandlers: Partial<TransactionsHandlers<ClientTransactions>>,
		options?: Partial<AllChannelReceiverOptions>,
	) {
		super(
			{
				[ClientRequestType.Ping]:
					requestHandlers[ClientRequestType.Ping] ||
					((_res, res) => {
						return res.success("pong");
					}),
				[ClientRequestType.GetLibraries]:
					requestHandlers[ClientRequestType.GetLibraries] ||
					notImplementedHandler,
				[ClientRequestType.SetSliceZone]:
					requestHandlers[ClientRequestType.SetSliceZone] ||
					notImplementedHandler,
				[ClientRequestType.SetSliceZoneFromSliceIDs]:
					requestHandlers[ClientRequestType.SetSliceZoneFromSliceIDs] ||
					notImplementedHandler,
			},
			{
				...rendererAPIDefaultOptions,
				// True if `debug=true` is among query parameters
				debug: /[\?&]debug=true/i.test(
					decodeURIComponent(window.location.search),
				),
				...options,
			},
		);
	}
}
