interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'table' | 'text' | 'image'
  count?: number
  className?: string
}

export default function SkeletonLoader({ 
  type = 'card', 
  count = 1,
  className = '' 
}: SkeletonLoaderProps) {
  const CardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  )

  const ListSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  )

  const TableSkeleton = () => (
    <tr className="animate-pulse">
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </td>
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </td>
      <td className="px-4 py-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </td>
      <td className="px-4 py-4">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </td>
    </tr>
  )

  const TextSkeleton = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  )

  const ImageSkeleton = () => (
    <div className="bg-gray-200 rounded-lg animate-pulse aspect-video"></div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <CardSkeleton />
      case 'list':
        return <ListSkeleton />
      case 'table':
        return <TableSkeleton />
      case 'text':
        return <TextSkeleton />
      case 'image':
        return <ImageSkeleton />
      default:
        return <CardSkeleton />
    }
  }

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={count > 1 && index < count - 1 ? 'mb-4' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}


