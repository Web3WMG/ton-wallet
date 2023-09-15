import { differenceInCalendarMonths, format } from 'date-fns';
import { toLowerCaseFirstLetter } from '../../utils/strings';
import { TronEvent } from '../../TronAPI/TronAPIGenerated';
import { Address } from '../../formatters/Address';
import { AccountEvent } from '../../TonAPI';
import {
  AnyActionTypePayload,
  ActionDestination,
  AnyActionPayload,
  ActionSource,
  ActionAmount,
  ActionType,
  ActionItem,
} from './ActivityModelTypes';

type CreateActionOptions = {
  source: ActionSource;
  event: AccountEvent;
  ownerAddress: string;
  actionIndex: number;
};

type CreateActionsOptions = {
  source: ActionSource;
  events: AccountEvent[];
  ownerAddress: string;
};

export class ActivityModel {
  static getGroupKey(timestamp: number) {
    const ts = new Date(timestamp * 1000);
    const now = new Date();

    if (differenceInCalendarMonths(now, ts) < 1) {
      return format(ts, 'd MMMM');
    }

    return format(ts, 'LLLL yyyy');
  }

  static createActions(
    options: CreateActionsOptions,
    iteration?: (action: ActionItem) => void,
  ) {
    return options.events.reduce<ActionItem[]>((activityActions, event) => {
      const eventActions = event.actions.reduce<ActionItem[]>((actions, _, index) => {
        const action = ActivityModel.createAction({
          ownerAddress: options.ownerAddress,
          source: options.source,
          actionIndex: index,
          event,
        });

        if (iteration) {
          iteration(action);
        }

        actions.push(action);
        return actions;
      }, []);

      activityActions.push(...eventActions);

      return activityActions;
    }, []);
  }

  static createAction({
    ownerAddress,
    actionIndex,
    source,
    event,
  }: CreateActionOptions): ActionItem {
    const action = event.actions[actionIndex];
    const payload = action[action.type];

    const type = (action as any).type as ActionType;
    const destination = this.defineActionDestination(ownerAddress, payload);
    const amount = this.createAmount({ type, payload });

    return {
      action_id: `${event.event_id}_${actionIndex}`,
      simple_preview: action.simple_preview,
      isLast: actionIndex === event.actions.length - 1,
      isFirst: actionIndex === 0,
      status: action.status,
      destination,
      payload,
      amount,
      source,
      event,
      type,
    };
  }

  static createAmount(action: AnyActionTypePayload): ActionAmount | null {
    const { payload, type } = action;

    switch (type) {
      case ActionType.WithdrawStakeRequest:
      case ActionType.ElectionsRecoverStake:
      case ActionType.ElectionsDepositStake:
      case ActionType.TonTransfer:
      case ActionType.DepositStake:
      case ActionType.WithdrawStake:
        if (payload.amount !== undefined) {
          return {
            value: String(payload.amount),
            symbol: 'TON',
          };
        } else {
          return null;
        }
      case ActionType.JettonMint:
      case ActionType.JettonBurn:
      case ActionType.JettonTransfer:
        return {
          value: payload.amount,
          symbol: payload.jetton.symbol,
          decimals: payload.jetton.decimals,
        };
      case ActionType.NftPurchase:
      case ActionType.AuctionBid:
      case ActionType.NftPurchase:
        return {
          value: payload.amount.value,
          symbol: payload.amount.token_name,
        };
      case ActionType.SmartContractExec:
        return {
          value: payload.ton_attached,
          symbol: 'TON',
        };
      case ActionType.ReceiveTRC20:
      case ActionType.SendTRC20:
        return {
          value: payload.amount,
          symbol: payload.token.symbol,
          decimals: payload.token.decimals,
        };
      default:
        return null;
    }
  }

  static defineActionDestination(
    ownerAddress: string,
    action: AnyActionPayload,
  ): ActionDestination {
    if (action && 'recipient' in action) {
      if (typeof action.recipient === 'object') {
        return Address.compare(action.recipient?.address, ownerAddress) ? 'in' : 'out';
      } else if (typeof action.recipient === 'string') {
        return action.recipient === ownerAddress ? 'in' : 'out';
      }
    }

    return 'unknown';
  }

  static normalizeTronEvent(event: TronEvent, eventIndex: number) {
    return {
      event_id: event.txHash + eventIndex,
      timestamp: event.timestamp / 1000,
      in_progress: event.inProgress,
      account: { address: '', is_scam: false },
      is_scam: false,
      lt: 0,
      extra: event.fees ? Number(event.fees.amount) : 0,
      actions: event.actions.map((action) => ({
        ...(action as any),
        [action.type]: action[toLowerCaseFirstLetter(action.type)],
        simple_preview: {
          name: action.type,
          description: '',
        },
      })),
    };
  }
}
