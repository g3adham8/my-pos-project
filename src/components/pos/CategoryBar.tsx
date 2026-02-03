import { useApp } from '../../context/AppContext';

export function CategoryBar() {
  const { state, dispatch } = useApp();
  const { categories, selectedCategory, products } = state;

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return products.filter(p => p.isActive).length;
    return products.filter(p => p.category === categoryId && p.isActive).length;
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.filter(c => c.isActive).map((category) => {
          const count = getCategoryCount(category.id);
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category.id })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all transform hover:scale-105 ${
                isSelected
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
              style={isSelected ? { backgroundColor: category.color } : {}}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
