import { CellItemToRender } from '@tonkeeper/mobile/src/tabs/Wallet/content-providers/utils/types';
import { View } from '../View';
import { List } from '../List';
import { Text } from '../Text';
import { HideableAmount } from '@tonkeeper/mobile/src/core/HideableAmount/HideableAmount';
import React from 'react';
import { Steezy } from '../../styles';
import { TextColors } from '../Text/Text';
import { Icon } from '../Icon';
import { TouchableOpacity } from '../TouchableOpacity';
import { tk } from '@tonkeeper/mobile/src/wallet';
import { triggerImpactMedium } from '@tonkeeper/mobile/src/utils';

interface ListItemRateProps {
  percent?: string;
  price: string;
  trend: string;
}

const trend2color: { [key: string]: TextColors } = {
  negative: 'accentRed',
  positive: 'accentGreen',
  unknown: 'textTertiary',
};

export const ListItemRate = (props: ListItemRateProps) => (
  <Text
    style={listItemRateStyles.title.static}
    numberOfLines={1}
    color="textSecondary"
    type="body2"
  >
    {props.price}
    <View style={listItemRateStyles.spacing} />
    {!!props.percent && (
      <Text
        style={listItemRateStyles.percentText.static}
        color={trend2color[props.trend]}
        type="body2"
      >
        {props.percent}
      </Text>
    )}
  </Text>
);

export enum AssetCellMode {
  EDITABLE = 'editable',
  VIEW_ONLY = 'view-only',
  DRAGGABLE = 'draggable',
}

export interface AssetCellProps {
  item: CellItemToRender;
  mode: AssetCellMode;
  drag?: () => void;
  onPinPress?: (identifier: string) => void;
  onEyePress?: (identifier: string) => void;
  isActiveDragging?: boolean;
}

const actionButtonsHitSlop = { top: 12, bottom: 12, left: 12, right: 12 };

export const AssetCell = (props: AssetCellProps) => {
  const mode = props.mode ?? AssetCellMode.VIEW_ONLY;
  const renderLeftContent = () => {
    if (props.item.renderIcon) {
      return props.item.renderIcon();
    }
  };

  const containerStyle = [
    !props.isActiveDragging && props.item.isFirst && styles.firstListItem,
    !props.isActiveDragging && props.item.isLast && styles.lastListItem,
    styles.containerListItem,
  ];

  const renderSubtitle = () => {
    return (
      props.item.subtitle ||
      (props.item.fiatRate && (
        <ListItemRate
          percent={props.item.fiatRate.percent}
          price={props.item.fiatRate.price.formatted}
          trend={props.item.fiatRate.trend}
        />
      ))
    );
  };

  const renderSubvalue = () => {
    switch (mode) {
      case AssetCellMode.EDITABLE:
        return null;
      case AssetCellMode.VIEW_ONLY:
        return (
          props.item.fiatRate && (
            <HideableAmount
              style={styles.subvalueText.static}
              type="body2"
              color="textSecondary"
            >
              {props.item.fiatRate.total.formatted}
            </HideableAmount>
          )
        );
    }
  };

  const renderRightContent = () => {
    switch (mode) {
      case AssetCellMode.VIEW_ONLY:
        return null;
      case AssetCellMode.EDITABLE:
        return (
          <View style={styles.actionsContainer}>
            {!props.item.isHidden && (
              <TouchableOpacity
                onPress={() => tk.wallet.tokenApproval.togglePinAsset(props.item.key)}
                hitSlop={actionButtonsHitSlop}
              >
                <Icon
                  color={
                    props.item.pinnedIndex !== undefined ? 'accentBlue' : 'iconTertiary'
                  }
                  name={'ic-pin-28'}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => props.onEyePress?.(props.item.key)}
              hitSlop={actionButtonsHitSlop}
            >
              <Icon
                color={props.item.isHidden ? 'iconTertiary' : 'accentBlue'}
                name={
                  props.item.isHidden ? 'ic-eye-closed-outline-28' : 'ic-eye-outline-28'
                }
              />
            </TouchableOpacity>
          </View>
        );
      case AssetCellMode.DRAGGABLE:
        return (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              onPress={() => props.onPinPress?.(props.item.key)}
              hitSlop={actionButtonsHitSlop}
            >
              <Icon
                color={
                  props.item.pinnedIndex !== undefined ? 'accentBlue' : 'iconTertiary'
                }
                name={'ic-pin-28'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              delayLongPress={50}
              onLongPress={() => {
                triggerImpactMedium();
                props.drag?.();
              }}
              hitSlop={actionButtonsHitSlop}
            >
              <Icon color={'iconSecondary'} name={'ic-reorder-28'} />
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={containerStyle}>
      <List.Item
        disabled={mode !== AssetCellMode.VIEW_ONLY}
        leftContent={renderLeftContent()}
        onPress={props.item.onPress}
        title={
          <View style={styles.tokenTitle}>
            <Text style={styles.valueText.static} type="label1">
              {props.item.title}
            </Text>
            {!!props.item.tag && (
              <View style={styles.tag}>
                <Text type="body4" color="textSecondary">
                  {props.item.tag.toUpperCase()}
                </Text>
              </View>
            )}
            {mode === AssetCellMode.VIEW_ONLY && props.item.pinnedIndex !== undefined && (
              <View style={styles.pin}>
                <Icon color="iconTertiary" name={'ic-pin-12'} />
              </View>
            )}
          </View>
        }
        picture={props.item.picture}
        rightContent={renderRightContent()}
        value={
          mode === AssetCellMode.VIEW_ONLY &&
          (typeof props.item.value === 'string' ? (
            <HideableAmount
              style={styles.valueText.static}
              type="label1"
              stars=" * * *"
            >{` ${props.item.value}`}</HideableAmount>
          ) : (
            props.item.value
          ))
        }
        subvalue={renderSubvalue()}
        subtitle={renderSubtitle()}
        bottomContent={
          mode === AssetCellMode.VIEW_ONLY && props.item.renderBottomContent?.()
        }
        subtitleStyle={props.item.subtitleStyle}
      />
    </View>
  );
};

const styles = Steezy.create(({ colors, corners }) => ({
  firstListItem: {
    borderTopLeftRadius: corners.medium,
    borderTopRightRadius: corners.medium,
  },
  lastListItem: {
    borderBottomLeftRadius: corners.medium,
    borderBottomRightRadius: corners.medium,
  },
  containerListItem: {
    overflow: 'hidden',
    backgroundColor: colors.backgroundContent,
    marginHorizontal: 16,
  },
  valueText: {
    textAlign: 'right',
    flexShrink: 1,
  },
  subvalueText: {
    color: colors.textSecondary,
    textAlign: 'right',
  },
  tokenTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.backgroundContentTint,
    alignSelf: 'center',
    paddingHorizontal: 5,
    paddingTop: 2.5,
    paddingBottom: 3.5,
    borderRadius: 4,
    marginLeft: 6,
  },
  pin: {
    marginLeft: 6,
    paddingVertical: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
}));

const listItemRateStyles = Steezy.create({
  spacing: {
    width: 6,
  },
  title: {
    marginRight: 6,
  },
  percentText: {
    opacity: 0.74,
  },
});