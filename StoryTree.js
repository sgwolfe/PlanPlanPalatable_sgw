Ext.define('PlanIterationsAndReleases.StoryTree', {
    extend: 'Ext.Container',
    
    initComponent: function(){
        this.callParent(arguments);
        this.add({
            xtype: 'component',
            autoEl: 'h1',
            html: 'Unscheduled Story Hierarchy'
        });
        this.add({
            xtype: 'component',
            cls: 'grayLabel',
            html: 'Drill down to see unscheduled leaf user stories. Drag and drop into an iteration on the right.'
        });
        this.buildTree();
    },
    
    buildTree: function(){
        var tree = Ext.widget('rallytree', {
            topLevelModel: 'PortfolioItem',
            enableDragAndDrop: true,
            childItemsStoreConfigForParentRecordFn: function(record){
                
                if(record.get('UserStories') && record.get('UserStories').length > 0){
                    return {
                        filters: [
                            {
                                property: 'PortfolioItem',
                                value: record.get('_ref'),
                                operator: '='
                            },
                            {
                                property: 'Iteration',
                                value: 'null',
                                operator: '='
                            }
                        ]
                    };
                }
                if(record.get('_type') === 'hierarchicalrequirement'){
                    return {
                        filters: [
                            {
                                property: 'Parent',
                                value: record.get('_ref'),
                                operator: '='
                            },
                            {
                                property: 'Iteration',
                                value: 'null',
                                operator: '='
                            }
                        ]
                    };
                }
                
            },
            childModelTypeForRecordFn: function(record){
                if(record.get('_type') === 'portfolioitem'){
                    if(record.get('Children') && record.get('Children').length > 0){
                        return 'PortfolioItem';
                    } else if(record.get('UserStories') && record.get('UserStories').length > 0){
                        return 'UserStory';
                    }
                }
                if(record.get('_type') === 'hierarchicalrequirement'){
                    return 'UserStory';
                }
                

            },
            parentAttributeForChildRecordFn: function(record){
                if(record.get('Children') && record.get('Children').length > 0){
                    return 'Parent';
                } else if(record.get('UserStories') && record.get('UserStories').length > 0){
                   return 'PortfolioItem';
                }
            },
            canExpandFn: function(record){
                return (record.get('Children') && record.get('Children').length > 0) || 
                (record.get('UserStories') && record.get('UserStories').length > 0);
            },
            dragThisGroupOnMeFn: function(record){
                return false;
            },
            treeItemConfigForRecordFn: function(record){
                var canDrag = record.get('_type') === 'hierarchicalrequirement' && record.get('Children').length === 0;
                
                var config = {
                    canDrag: canDrag
                };
                if(record.get('_type') === 'hierarchicalrequirement'){
                    config.xtype = 'rallystorytreeitem';
                }
                return config;
            }

        });
        
        this.add(tree);
    }
});