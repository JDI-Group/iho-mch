import { formatEther } from '@hairy/ether-lib'
import { useAsyncState } from '@hairy/react-lib'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import dayjs from 'dayjs'
import { useMount } from 'react-use'
import { useAccount } from 'wagmi'

const options = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'this-week', label: 'This week' },
]

const dropdownItemClassNames = {
  base: 'py-1',
  title: 'text-tiny',
}

export function HomeRevenueCard() {
  const { address } = useAccount()
  const [type, setType] = useState<'today' | 'yesterday' | 'this-week'>('today')

  const [{ value: rewards }, reloadRewards] = useAsyncState(
    async () => {
      const logs = await getMinerRewardsDaily({ owner: address! })
      // filter out rewards with main currency
      return logs.map(log => ({
        ...log,
        amount: BigInt(log.reward),
        timestamp: Number(log.timestamp),
      }))
    },
    [address],
    { immediate: true },
  )

  // 根据选择的时间范围过滤收益数据
  const data = useMemo(() => {
    if (!rewards || rewards.length === 0)
      return []

    const now = dayjs()
    const startOfToday = now.startOf('day')
    const startOfYesterday = now.subtract(1, 'day').startOf('day')
    const endOfYesterday = now.subtract(1, 'day').endOf('day')

    // 按时间戳排序
    const sortedRewards = [...rewards].sort((a, b) => Number(a.timestamp - b.timestamp))

    if (type === 'today') {
      return sortedRewards
        .filter(reward => dayjs.unix(Number(reward.timestamp)).isAfter(startOfToday))
        .map(reward => ({
          time: dayjs.unix(Number(reward.timestamp)).format('HH:mm'),
          value: Number(formatEther(reward.amount)),
        }))
    }

    if (type === 'yesterday') {
      return sortedRewards
        .filter((reward) => {
          const rewardTime = dayjs.unix(Number(reward.timestamp))
          return rewardTime.isAfter(startOfYesterday) && rewardTime.isBefore(endOfYesterday)
        })
        .map(reward => ({
          time: dayjs.unix(Number(reward.timestamp)).format('HH:mm'),
          value: Number(formatEther(reward.amount)),
        }))
    }

    if (type === 'this-week') {
      const startOfWeek = now.subtract(7, 'day').startOf('day')
      return sortedRewards
        .filter(reward => dayjs.unix(Number(reward.timestamp)).isAfter(startOfWeek))
        .map(reward => ({
          time: dayjs.unix(Number(reward.timestamp)).format('MM-DD'),
          value: Number(formatEther(reward.amount)),
        }))
    }

    return []
  }, [rewards, type])

  // 计算总收益
  const total = useMemo(() => {
    if (!rewards || rewards.length === 0)
      return 0n

    const now = dayjs()
    const startOfToday = now.startOf('day')
    const startOfYesterday = now.subtract(1, 'day').startOf('day')
    const endOfYesterday = now.subtract(1, 'day').endOf('day')

    if (type === 'today') {
      return rewards
        .filter(reward => dayjs.unix(Number(reward.timestamp)).isAfter(startOfToday))
        .reduce((sum, reward) => sum + reward.amount, 0n)
    }

    if (type === 'yesterday') {
      return rewards
        .filter((reward) => {
          const rewardTime = dayjs.unix(Number(reward.timestamp))
          return rewardTime.isAfter(startOfYesterday) && rewardTime.isBefore(endOfYesterday)
        })
        .reduce((sum, reward) => sum + reward.amount, 0n)
    }

    if (type === 'this-week') {
      const startOfWeek = now.subtract(7, 'day').startOf('day')
      return rewards
        .filter(reward => dayjs.unix(Number(reward.timestamp)).isAfter(startOfWeek))
        .reduce((sum, reward) => sum + reward.amount, 0n)
    }

    return 0n
  }, [rewards, type])

  const contrast = useMemo(() => {
    if (!rewards || rewards.length === 0)
      return 0

    const now = dayjs()
    const startOfToday = now.startOf('day')
    const startOfYesterday = now.subtract(1, 'day').startOf('day')
    const endOfYesterday = now.subtract(1, 'day').endOf('day')
    const startOfDayBeforeYesterday = now.subtract(2, 'day').startOf('day')
    const endOfDayBeforeYesterday = now.subtract(2, 'day').endOf('day')
    const startOfLastWeek = now.subtract(14, 'day').startOf('day')
    const endOfLastWeek = now.subtract(7, 'day').endOf('day')

    if (type === 'today') {
      const todayTotal = rewards
        .filter(reward => dayjs.unix(Number(reward.timestamp)).isAfter(startOfToday))
        .reduce((sum, reward) => sum + Number(formatEther(reward.amount)), 0)

      const yesterdayTotal = rewards
        .filter((reward) => {
          const rewardTime = dayjs.unix(Number(reward.timestamp))
          return rewardTime.isAfter(startOfYesterday) && rewardTime.isBefore(endOfYesterday)
        })
        .reduce((sum, reward) => sum + Number(formatEther(reward.amount)), 0)

      if (yesterdayTotal === 0)
        return 0
      return Math.round((todayTotal - yesterdayTotal) / yesterdayTotal * 100)
    }

    if (type === 'yesterday') {
      const yesterdayTotal = rewards
        .filter((reward) => {
          const rewardTime = dayjs.unix(Number(reward.timestamp))
          return rewardTime.isAfter(startOfYesterday) && rewardTime.isBefore(endOfYesterday)
        })
        .reduce((sum, reward) => sum + Number(formatEther(reward.amount)), 0)

      const dayBeforeYesterdayTotal = rewards
        .filter((reward) => {
          const rewardTime = dayjs.unix(Number(reward.timestamp))
          return rewardTime.isAfter(startOfDayBeforeYesterday) && rewardTime.isBefore(endOfDayBeforeYesterday)
        })
        .reduce((sum, reward) => sum + Number(formatEther(reward.amount)), 0)

      if (dayBeforeYesterdayTotal === 0)
        return 0
      return Math.round((yesterdayTotal - dayBeforeYesterdayTotal) / dayBeforeYesterdayTotal * 100)
    }

    if (type === 'this-week') {
      const thisWeekTotal = rewards
        .filter((reward) => {
          const startOfWeek = dayjs().subtract(7, 'day').startOf('day')
          return dayjs.unix(Number(reward.timestamp)).isAfter(startOfWeek)
        })
        .reduce((sum, reward) => sum + Number(formatEther(reward.amount)), 0)

      const lastWeekTotal = rewards
        .filter((reward) => {
          const rewardTime = dayjs.unix(Number(reward.timestamp))
          return rewardTime.isAfter(startOfLastWeek) && rewardTime.isBefore(endOfLastWeek)
        })
        .reduce((sum, reward) => sum + Number(formatEther(reward.amount)), 0)

      if (lastWeekTotal === 0)
        return 0
      return Math.round((thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100)
    }

    return 0
  }, [rewards, type])

  useMount(reloadRewards)
  return (
    <TrendCard
      title={`${options.find(o => o.key === type)?.label || 'Today'}'s Revenue`}
      value={formatEther(total)}
      symbol="MXC"
      change={`${contrast}%`}
      changeType={contrast > 0 ? 'positive' : contrast < 0 ? 'negative' : 'neutral'}
      changeText={{
        'today': ' vs yesterday',
        'yesterday': ' vs before yesterday',
        'this-week': ' vs last week',
      }[type]}
      areaData={data}
      areaType="natural"
      areaKey="value"
      extra={(
        <Dropdown size="sm" classNames={{ content: 'min-w-[150px]' }}>
          <DropdownTrigger>
            <Button isIconOnly variant="light" size="sm" className="absolute right-2 top-2 w-auto rounded-full">
              <Icon className="text-gray-600" fontSize="15" icon="mi:switch" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            {options.map(option => (
              <DropdownItem
                onClick={() => setType(option.key as 'today' | 'yesterday' | 'this-week')}
                classNames={dropdownItemClassNames}
                key={option.key}
                className={type === option.key ? 'bg-primary text-default-50' : ''}
              >
                {option.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}
    />
  )
}
