<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#8AB4F8',
    tabBarInactiveTintColor: '#9BA1A6',
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarStyle: {
      paddingBottom: insets.bottom,
      height: 49 + insets.bottom,
      backgroundColor: '#0A0A0A',
      borderTopColor: 'rgba(138, 180, 248, 0.3)',
      borderTopWidth: 1,
    },
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: "Home",
      tabBarIcon: ({ color }) => (
        <IconSymbol 
          size={28} 
          name="house.fill"
          color={color}
        />
      ),
    }}
  />
  <Tabs.Screen
    name="survey"
    options={{
      title: "Survey",
      tabBarIcon: ({ color }) => (
        <IconSymbol 
          size={28} 
          name="list.clipboard"
          color={color}
        />
      ),
    }}
  />
  <Tabs.Screen
    name="calculator"
    options={{
      title: "Calculator",
      tabBarIcon: ({ color }) => (
        <IconSymbol 
          size={28} 
          name="number.square"
          color={color}
        />
      ),
    }}
  />
  <Tabs.Screen
    name="expenses"
    options={{
      title: "Expenses",
      tabBarIcon: ({ color }) => (
        <IconSymbol 
          size={28} 
          name="dollarsign.circle"
          color={color}
        />
      ),
    }}
  />
  <Tabs.Screen
    name="payroll"
    options={{
      title: "Payroll",
      tabBarIcon: ({ color }) => (
        <IconSymbol 
          size={28} 
          name="creditcard"
          color={color}
        />
      ),
    }}
  />
  <Tabs.Screen
    name="sales"
    options={{
      title: "Sales",
      tabBarIcon: ({ color }) => (
        <IconSymbol 
          size={28} 
          name="chart.bar"
          color={color}
        />
      ),
    }}
  />
</Tabs>
