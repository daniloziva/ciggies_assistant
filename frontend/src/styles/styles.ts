const styles = {
  // Button styles
  button: {
    primary: `bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 
              transition-colors duration-200 font-medium text-sm
              disabled:bg-blue-300 disabled:cursor-not-allowed`,
    secondary: `bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 
                transition-colors duration-200 font-medium text-sm
                border border-gray-200`
  },

  // Input styles
  input: `w-full bg-transparent border-0 border-b border-gray-200 
          focus:ring-0 focus:border-blue-500 transition-colors duration-200
          text-gray-800 text-sm py-2`,

  // Label styles
  label: `text-xs font-medium text-gray-500 mb-1`,

  // Section styles
  section: `bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6`,

  // Container styles
  container: `max-w-5xl mx-auto px-4 sm:px-6 lg:px-8`,

  // Table styles
  table: {
    header: `text-left text-sm text-gray-500`,
    cell: `py-3 px-4`,
    row: `border-t border-gray-100`
  },

  // Text styles
  text: {
    title: `text-2xl font-semibold text-gray-900`,
    subtitle: `text-sm italic text-gray-500`,
    body: `text-gray-700`,
    label: `text-sm font-medium text-gray-500`
  },

  // Separator
  separator: `h-px bg-gray-200`,

  // Layout
  layout: {
    grid: `grid grid-cols-2 gap-12 mb-12`,
    flex: `flex justify-between items-center`
  }
};

export default styles; 