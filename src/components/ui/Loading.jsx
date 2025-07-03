import { motion } from 'framer-motion'

const Loading = ({ type = 'cards' }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4"></div>
      <div className="flex items-center justify-between">
        <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  )

  const SkeletonForm = () => (
    <div className="bg-white rounded-xl shadow-card p-6 animate-pulse">
      <div className="mb-6">
        <div className="w-48 h-8 bg-gray-200 rounded mb-2"></div>
        <div className="w-64 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  )

  const SkeletonList = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-xl shadow-card p-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {type === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
      
      {type === 'form' && <SkeletonForm />}
      
      {type === 'list' && <SkeletonList />}
    </motion.div>
  )
}

export default Loading